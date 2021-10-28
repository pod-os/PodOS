import { Component, EventEmitter, Event, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-resource',
  shadow: true,
})
export class PosResource {
  @State() os: any;

  @Prop() uri: string;

  @Event({ eventName: 'consumeOs' }) consumeOsEmitter: EventEmitter;

  @State()
  private error: any;

  @State()
  private loading: boolean = true;

  componentWillLoad() {
    this.consumeOsEmitter.emit(this.setOs);
  }

  setOs = async (os: any) => {
    this.os = os;
  };

  @Watch('os')
  async loadResource(value: any) {
    try {
      await value.fetch(this.uri);
    } catch (err) {
      this.error = err;
    }
    this.loading = false;
  }

  render() {
    if (this.loading) {
      return <ion-progress-bar type="indeterminate"></ion-progress-bar>;
    }
    if (this.error) {
      return <div>{this.error.message}</div>;
    }
    return <slot />;
  }
}
