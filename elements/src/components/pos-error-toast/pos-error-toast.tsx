import { Component, h, Host, Listen, State } from '@stencil/core';
import { Problem } from '@pod-os/core';

import './shoelace';
import { SlAlert } from '@shoelace-style/shoelace';

@Component({
  tag: 'pos-error-toast',
  shadow: true,
})
export class PosErrorToast {
  private alert: SlAlert;

  @State()
  private title: string;

  @State()
  private message: string;

  @Listen('unhandledrejection', { target: 'window' })
  async unhandledRejection(event: PromiseRejectionEvent) {
    event.stopPropagation();
    console.error('unhandled promise rejection', event);
    this.title = 'Unhandled promise rejection';
    this.message = event.reason.toString();
  }

  @Listen('pod-os:error')
  async catchError(event) {
    event.stopPropagation();
    console.error(event.detail);
    if (event.detail instanceof Error) {
      this.title = 'Error';
      this.message = event.detail.message;
    } else {
      const problem = event.detail as Problem;
      this.title = problem.title;
      this.message = problem.detail;
    }
    await this.alert.toast();
  }

  render() {
    return (
      <Host>
        <sl-alert ref={el => (this.alert = el)} variant="danger" duration="10000" closable>
          <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
          <strong>{this.title}</strong>
          <br />
          {this.message}
        </sl-alert>
        <slot></slot>
      </Host>
    );
  }
}
