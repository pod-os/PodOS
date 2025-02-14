import { Component, Event, h, Prop, State, Watch } from '@stencil/core';
import { LabelIndex, PodOS, Thing, WebIdProfile } from '@pod-os/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';
import session from '../../store/session';

@Component({
  tag: 'pos-make-findable',
  styleUrl: 'pos-make-findable.css',
})
export class PosMakeFindable implements PodOsAware {
  @Prop() uri!: string;

  @State() os: PodOS;
  @State() thing: Thing;
  @State() indexes: LabelIndex[];

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  @State() unsubscribeSessionChange: undefined | (() => void);

  componentWillLoad() {
    subscribePodOs(this);
  }

  disconnectedCallback() {
    this.unsubscribeSessionChange && this.unsubscribeSessionChange();
  }

  @Watch('uri')
  updateUri(uri: string) {
    this.thing = this.os.store.get(uri);
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
    }
  }

  private async makeFindable(e: MouseEvent) {
    e.preventDefault();
    await this.os.addToLabelIndex(this.thing, this.indexes[0]);
  }

  render() {
    if (!session.state.isLoggedIn) {
      return null;
    }
    return (
      <button onClick={e => this.makeFindable(e)} title="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
          />
        </svg>
        <p>Make this findable</p>
      </button>
    );
  }
}
