import { Component, Element, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { LabelIndex, PodOS, Thing, WebIdProfile } from '@pod-os/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';
import session from '../../store/session';

import './shoelace';

@Component({
  tag: 'pos-make-findable',
  styleUrl: 'pos-make-findable.css',
  shadow: true,
})
export class PosMakeFindable implements PodOsAware {
  @Prop() uri!: string;

  @State() os: PodOS;
  @State() thing: Thing;
  @State() indexes: LabelIndex[] = [];

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  @State() unsubscribeSessionChange: undefined | (() => void);

  @State() showOptions = false;
  @State() isIndexed = false;

  @Event({ eventName: 'pod-os:error' }) errorEmitter: EventEmitter;
  @Event({ eventName: 'pod-os:search:index-updated' }) indexUpdatedEmitter: EventEmitter;
  @Event({ eventName: 'pod-os:search:index-created' }) indexCreatedEmitter: EventEmitter;

  @Element() el: HTMLElement;

  componentWillLoad() {
    subscribePodOs(this);
  }

  disconnectedCallback() {
    this.unsubscribeSessionChange && this.unsubscribeSessionChange();
  }

  @Watch('uri')
  updateUri(uri: string) {
    this.thing = this.os.store.get(uri);
    this.isIndexed = this.checkIfIndexed(uri);
  }

  private checkIfIndexed(uri: string) {
    return this.indexes.some(it => it.contains(uri));
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
    this.thing = this.os.store.get(this.uri);
    this.getLabelIndexes(session.state.profile);
    this.unsubscribeSessionChange = session.onChange('profile', profile => {
      this.getLabelIndexes(profile);
    });
  };

  private getLabelIndexes(profile: WebIdProfile) {
    if (profile) {
      this.indexes = profile.getPrivateLabelIndexes().map(it => this.os.store.get(it).assume(LabelIndex));
      this.showOptions = this.indexes.length > 1;
      this.isIndexed = this.checkIfIndexed(this.uri);
    }
  }

  private async onClick(e: MouseEvent) {
    e.preventDefault();
    if (this.indexes.length === 1) {
      const index = this.indexes[0];
      await this.addToLabelIndex(index);
      this.indexUpdatedEmitter.emit(index);
    } else if (this.indexes.length === 0) {
      const index = await this.createDefaultLabelIndex();
      await this.addToLabelIndex(index);
      this.indexCreatedEmitter.emit(index);
    }
  }

  private async addToLabelIndex(index: LabelIndex) {
    try {
      await this.os.addToLabelIndex(this.thing, index);
      this.isIndexed = true;
    } catch (e) {
      this.errorEmitter.emit(e);
    }
  }

  private async createDefaultLabelIndex(): Promise<LabelIndex> {
    try {
      return await this.os.createDefaultLabelIndex(session.state.profile);
    } catch (e) {
      this.errorEmitter.emit(e);
    }
  }

  render() {
    if (!session.state.isLoggedIn || !this.uri) {
      return null;
    }

    const label = 'Make this findable';
    const button = (
      <button
        type="button"
        slot="trigger"
        aria-label={label}
        class={{ main: true, success: this.isIndexed }}
        onClick={e => this.onClick(e)}
        title=""
      >
        {this.isIndexed ? <IconSuccess /> : <IconMakeFindable />}
        <p>{label}</p>
      </button>
    );
    if (this.showOptions) {
      return (
        <Host>
          <sl-dropdown>
            {button}
            <sl-menu role="listbox">
              {this.indexes.map((index: LabelIndex) => (
                <sl-menu-item role="option" value={index} type="checkbox" checked={index.contains(this.uri)}>
                  <pos-resource uri={index.uri} lazy={true}>
                    <pos-label></pos-label>
                  </pos-resource>
                </sl-menu-item>
              ))}
            </sl-menu>
          </sl-dropdown>
        </Host>
      );
    } else {
      return button;
    }
  }

  @Listen('sl-select')
  async onSelect(e: CustomEvent<{ item: { value: LabelIndex } }>) {
    const index = e.detail.item.value;
    e.preventDefault();
    await this.addToLabelIndex(index);
    this.indexUpdatedEmitter.emit(index);
  }
}

const IconMakeFindable = () => (
  <svg
    role="presentation"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
    />
  </svg>
);

const IconSuccess = () => (
  <svg
    role="presentation"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
    />
  </svg>
);
