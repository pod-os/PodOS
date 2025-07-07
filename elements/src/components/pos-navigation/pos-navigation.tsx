import { PodOS, SearchIndex, Thing } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';

import session from '../../store/session';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-navigation',
  shadow: true,
  styleUrl: 'pos-navigation.css',
})
export class PosNavigation implements PodOsAware {
  @State() os: PodOS;
  private dialogRef?: HTMLDialogElement;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;
  @Prop() uri: string = '';

  @State() value: string = this.uri;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @State() searchIndex?: SearchIndex = undefined;

  @State() suggestions = [];

  @State() selectedIndex = -1;

  @State() resource: Thing = null;

  @Watch('uri')
  async getResource() {
    // TODO should this be done on componentWillLoad?
    this.resource = this.uri ? this.os.store.get(this.uri) : null;
  }

  componentWillLoad() {
    subscribePodOs(this);
    session.onChange('isLoggedIn', async isLoggedIn => {
      if (isLoggedIn) {
        await this.buildSearchIndex();
      } else {
        this.clearSearchIndex();
      }
    });
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
  openNavigationDialog() {
    this.dialogRef?.showModal();
  }

  private clearSearchIndex() {
    this.searchIndex?.clear();
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  private onChange(event) {
    this.value = event.target.value;
    // TODO add debounce
    this.search();
  }

  @Listen('click', { target: 'document' })
  @Listen('pod-os:link')
  clearSuggestions() {
    this.suggestions = [];
    this.selectedIndex = -1;
  }

  @Listen('click')
  onClickSelf(event) {
    event.stopPropagation();
  }

  @Listen('keydown')
  handleKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.clearSuggestions();
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
      this.suggestions = this.value ? this.searchIndex.search(this.value) : [];
    }
  }

  private onSubmit(event) {
    if (this.suggestions && this.selectedIndex > -1) {
      this.linkEmitter.emit(this.suggestions[this.selectedIndex].ref);
    } else {
      this.linkEmitter.emit(this.value);
    }
  }

  render() {
    // TODO: move make findable to pos-navigation-bar
    return (
      <Host>
        {this.searchIndex && this.uri ? <pos-make-findable uri={this.uri}></pos-make-findable> : ''}
        {this.resource && <pos-navigation-bar current={this.resource}></pos-navigation-bar>}
        <dialog ref={el => (this.dialogRef = el as HTMLDialogElement)}>
          <form method="dialog" onSubmit={e => this.onSubmit(e)}>
            <div class="bar">
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
            </div>
          </form>
        </dialog>
      </Host>
    );
  }
}
