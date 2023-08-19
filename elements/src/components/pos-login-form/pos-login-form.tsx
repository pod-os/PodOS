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

  /**
   * Emits the selected IDP URL to use for login
   */
  @Event({ eventName: 'pod-os:idp-url-selected' }) idpUrlSelected: EventEmitter;

  @Watch('idpUrl')
  validate() {
    this.canSubmit = Boolean(this.idpUrl);
  }

  render(): any {
    return (
      <form method="dialog" onSubmit={() => this.handleSubmit()}>
        <label htmlFor="idpUrl">URL</label>
        <input id="idpUrl" type="text" value={this.idpUrl} onInput={e => this.handleChange(e)} list="suggestedIssuers" />
        <input id="login" type="submit" value="Login" disabled={!this.canSubmit} />
        <datalist id="suggestedIssuers">
          <option value="https://solidcommunity.net">Solid Community</option>
          <option value="https://solidweb.org">Solid Web</option>
          <option value="https://inrupt.net">Inrupt.net</option>
          <option value="https://login.inrupt.com">pod.Inrupt.com</option>
        </datalist>
      </form>
    );
  }

  handleChange(event) {
    this.validate()
    this.idpUrl = event.target.value;
  }

  async handleSubmit() {
      this.idpUrlSelected.emit(this.idpUrl);
  }

}
