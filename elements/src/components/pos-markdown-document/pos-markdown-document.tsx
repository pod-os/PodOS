import { SolidFile } from '@pod-os/core';
import { Component, h, Method, Prop, State, Event, EventEmitter } from '@stencil/core';

import { RichEditor } from './rich-editor';

import './shoelace';
import { map, Subject, takeUntil, tap } from 'rxjs';

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
   * Whether saving the latest changes failed
   */
  @Prop()
  savingFailed: boolean = false;

  /**
   * Whether the current user has the permission to edit the file
   */
  @Prop()
  editable: boolean = false;

  @State()
  private markdown: string;

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
    this.markdown = await this.file.blob().text();
  }

  componentDidLoad() {
    this.editor = new RichEditor(this.editorEl, this.markdown, this.file.url);
    this.editor.onUpdate(() => {
      this.isModified = true;
    });
    this.editor
      .observeChanges()
      .pipe(
        takeUntil(this.disconnected$),
        map(changes => changes.content),
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
  async startEditing() {
    this.editor.startEditing();
    this.isEditing = true;
  }

  /**
   * Switch to view mode
   */
  @Method()
  async stopEditing() {
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
                <sl-icon name="eye"></sl-icon>
                View
              </button>
            ) : (
              <button onClick={() => this.startEditing()}>
                <sl-icon name="pencil-square"></sl-icon>
                Edit
              </button>
            )}
          </header>
        ) : null}
        <div class="content" ref={el => (this.editorEl = el)}></div>
      </article>
    );
  }

  private getStatus() {
    if (this.isModified) {
      return <Status status="pending" message="pending changes" icon="clock-history"></Status>;
    }
    if (this.savingFailed) {
      return <Status status="error" message="saving failed" icon="x-octagon"></Status>;
    }
    return <Status status="success" message="all saved" icon="check2-circle"></Status>;
  }
}

function Status({ status, icon, message }) {
  return (
    <span
      class={{
        status: true,
        [status]: true,
      }}
      role="status"
      aria-live="polite"
      aria-labelledby="status-message"
    >
      <sl-icon name={icon} aria-hidden="true"></sl-icon>
      <span id="status-message">{message}</span>
    </span>
  );
}
