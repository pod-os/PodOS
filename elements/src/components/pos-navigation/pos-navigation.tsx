import { PodOS, SearchIndex, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { debounceTime, Subject } from 'rxjs';

import session from '../../store/session';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

interface NavigateEvent {
  detail: Thing | null;
}

@Component({
  tag: 'pos-navigation',
  shadow: true,
  styleUrl: 'pos-navigation.css',
})
export class PosNavigation implements PodOsAware {
  @State() private os: PodOS;
  private dialogRef?: HTMLDialogElement;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  /**
   * Initial value of the navigation bar
   */
  @Prop() uri: string = '';

  /**
   * Current value of the input field
   */
  @State() private inputValue: string = this.uri;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @State() searchIndex?: SearchIndex = undefined;

  @State() private suggestions = [];

  @State() private selectedIndex = -1;

  @State() private resource: Thing = null;

  private readonly changeEvents = new Subject<void>();
  private debouncedSearch = null;

  @Watch('uri')
  @Watch('os')
  updateResource(): void {
    this.resource = this.uri ? this.os?.store.get(this.uri) : null;
  }

  componentWillLoad() {
    subscribePodOs(this);
    this.updateResource();
    session.onChange('isLoggedIn', async isLoggedIn => {
      if (isLoggedIn) {
        await this.buildSearchIndex();
      } else {
        this.clearSearchIndex();
      }
    });
    this.debouncedSearch = this.changeEvents.pipe(debounceTime(300)).subscribe(() => this.search());
  }

  disconnectedCallback() {
    this.debouncedSearch?.unsubscribe();
  }

  @Listen('pod-os:search:index-created')
  private async buildSearchIndex() {
    this.searchIndex = await this.os.buildSearchIndex(session.state.profile);
  }

  @Listen('pod-os:search:index-updated')
  rebuildSearchIndex() {
    this.searchIndex.rebuild();
  }

  @Listen('pod-os:navigate')
  openNavigationDialog(e: NavigateEvent) {
    this.resource = e.detail;
    if (e.detail) {
      this.inputValue = e.detail.uri;
      this.search();
    }
    this.dialogRef?.show();
  }

  private clearSearchIndex() {
    this.searchIndex?.clear();
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  private onChange(event) {
    this.inputValue = event.target.value;
    this.changeEvents.next();
  }

  @Listen('click', { target: 'document' })
  closeDialog() {
    this.dialogRef?.close();
    this.selectedIndex = -1;
  }

  @Listen('pod-os:link')
  clearSuggestions() {
    this.suggestions = [];
    this.dialogRef?.close();
    this.selectedIndex = -1;
  }

  @Listen('click')
  onClickSelf(event) {
    event.stopPropagation();
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.closeDialog();
    } else if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
    }
  }

  private search() {
    if (this.searchIndex) {
      this.suggestions = this.inputValue ? this.searchIndex.search(this.inputValue) : [];
    }
  }

  private onSubmit() {
    if (this.suggestions && this.selectedIndex > -1) {
      this.linkEmitter.emit(this.suggestions[this.selectedIndex].ref);
    } else {
      this.linkEmitter.emit(this.inputValue);
    }
  }

  render() {
    return (
      <Host>
        <div class="container">
          <pos-navigation-bar
            searchIndexReady={this.searchIndex !== undefined}
            current={this.resource}
          ></pos-navigation-bar>
          <dialog ref={el => (this.dialogRef = el)}>
            <form method="dialog" onSubmit={() => this.onSubmit()}>
              <input
                enterkeyhint="search"
                placeholder="Search or enter URI"
                value={this.uri}
                onChange={e => this.onChange(e)}
                onInput={e => this.onChange(e)}
              />
              {this.suggestions.length > 0 ? (
                <div class="suggestions">
                  <ol>
                    {this.suggestions.map((it, index) => (
                      <li class={index === this.selectedIndex ? 'selected' : ''}>
                        <pos-rich-link uri={it.ref}></pos-rich-link>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </form>
          </dialog>
        </div>
      </Host>
    );
  }
}
