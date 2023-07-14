import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-login-form',
  shadow: {
    delegatesFocus: true,
  },
})
export class PosLoginForm {
  @State() idpUrl: string = "http://localhost:3000";

  @State() canSubmit: boolean = true;

  @Event({ eventName: 'idpUrlSelected' }) idpUrlSelected: EventEmitter;
  @Event({ eventName: 'pod-os:error' }) errorEmitter: EventEmitter;

  @Watch('idpUrl')
  validate() {
    this.canSubmit = Boolean(this.idpUrl);
  }

  render(): any {
    return (
      <form method="dialog" onSubmit={e => this.handleSubmit(e)}>
        <label htmlFor="idpUrl">URL</label>
        <input id="idpUrl" type="text" value={this.idpUrl} onInput={e => this.handleChange(e)} />
        <input id="login" type="submit" value="Login" disabled={!this.canSubmit} />
      </form>
    );
  }

  handleChange(event) {
    this.validate()
    this.idpUrl = event.target.value;
  }

  async handleSubmit(event) {
    try {
      this.idpUrlSelected.emit(this.idpUrl);
    } catch (error) {
      event.preventDefault();
      this.errorEmitter.emit(error);
    }
  }

}
