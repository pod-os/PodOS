import { SolidFile } from '@pod-os/core';
import { Component, h, Method, Prop, State, Event, EventEmitter } from '@stencil/core';

import { marked } from 'marked';
import { sanitize, SanitizedHtml } from './sanitize';
import { RichEditor } from './rich-editor';

import './shoelace';
import { map, Subject, takeUntil, tap } from 'rxjs';
import { html2markdown } from './html2markdown';

interface ModifiedFile {
  file: SolidFile;
  newContent: string;
}

@Component({
  tag: 'pos-markdown-document',
  styleUrls: ['pos-markdown-document.css', '../../apps/styles/article-card.css'],
  shadow: true,
})
export class PosMarkdownDocument {
  /**
   * The file to show / edit
   */
  @Prop()
  file: SolidFile;

  /**
   * Whether the current user has the permission to edit the file
   */
  @Prop()
  editable: boolean = false;

  @State()
  private sanitizedHtml: SanitizedHtml;

  private editorEl: HTMLElement;

  @State()
  private isModified: boolean = false;

  private editor: RichEditor;

  @State()
  private isEditing: boolean = false;

  /**
   * Event emitted when the document has been modified
   */
  @Event({ eventName: 'pod-os:document-modified' })
  documentModified: EventEmitter<ModifiedFile>;

  private readonly disconnected$ = new Subject<void>();

  async componentWillLoad() {
    const markdown = await this.file.blob().text();
    const html = await marked(markdown);
    this.sanitizedHtml = sanitize(html);
  }

  componentDidLoad() {
    this.editor = new RichEditor(this.editorEl, this.sanitizedHtml, this.file.url);
    this.editor.onUpdate(() => {
      this.isModified = this.editor.isModified();
    });
    this.editor
      .observeChanges()
      .pipe(
        takeUntil(this.disconnected$),
        map(changes => html2markdown(changes.content)),
        tap(markdown => {
          this.isModified = false;
          this.documentModified.emit({
            file: this.file,
            newContent: markdown,
          });
        }),
      )
      .subscribe();
  }

  disconnectedCallback() {
    this.disconnected$.next();
    this.disconnected$.unsubscribe();
  }

  /**
   * Switch to editing mode
   */
  @Method()
  startEditing() {
    this.editor.startEditing();
    this.isEditing = true;
  }

  /**
   * Switch to view mode
   */
  @Method()
  stopEditing() {
    this.editor.stopEditing();
    this.isEditing = false;
  }

  render() {
    return (
      <article>
        {this.editable ? (
          <header>
            {this.isEditing ? this.getStatus() : null}
            {this.isEditing ? (
              <button onClick={() => this.stopEditing()}>
                <sl-icon name="eye"></sl-icon>View
              </button>
            ) : (
              <button onClick={() => this.startEditing()}>
                <sl-icon name="pencil-square"></sl-icon>Edit
              </button>
            )}
          </header>
        ) : null}
        <div class="content" ref={el => (this.editorEl = el)}></div>
      </article>
    );
  }

  private getStatus() {
    return this.isModified ? (
      <span class="status">
        <sl-icon name="clock-history"></sl-icon>pending changes
      </span>
    ) : (
      <span class="status">
        <sl-icon name="check2-circle"></sl-icon>all saved
      </span>
    );
  }
}
