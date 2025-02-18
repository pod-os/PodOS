import { PodOS, SearchIndex } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Listen, Prop, State } from '@stencil/core';

import session from '../../store/session';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-navigation-bar',
  shadow: true,
  styleUrl: 'pos-navigation-bar.css',
})
export class PosNavigationBar implements PodOsAware {
  @State() os: PodOS;

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;
  @Prop() uri: string = '';

  @State() value: string = this.uri;

  @Event({ eventName: 'pod-os:link' }) linkEmitter: EventEmitter;

  @State() searchIndex?: SearchIndex = undefined;

  @State() suggestions = [];

  @State() selectedIndex = -1;

  componentWillLoad() {
    subscribePodOs(this);
    session.onChange('isLoggedIn', async isLoggedIn => {
      if (isLoggedIn) {
        this.searchIndex = await this.os.buildSearchIndex(session.state.profile);
      } else {
        this.searchIndex?.clear();
      }
    });
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  private onChange(event) {
    this.value = event.detail.value;
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
    event.preventDefault();
    if (this.suggestions && this.selectedIndex > -1) {
      this.linkEmitter.emit(this.suggestions[this.selectedIndex].ref);
    } else {
      this.linkEmitter.emit(this.value);
    }
  }

  render() {
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <pos-make-findable uri={this.uri}></pos-make-findable>
        <div class="bar">
          <ion-searchbar
            enterkeyhint="search"
            placeholder="Search or enter URI"
            value={this.uri}
            debounce={300}
            onIonChange={e => this.onChange(e)}
            onIonInput={e => this.onChange(e)}
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
    );
  }
}
