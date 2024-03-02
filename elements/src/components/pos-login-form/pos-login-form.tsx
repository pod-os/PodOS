import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-login-form',
  shadow: {
    delegatesFocus: true,
  },
})
export class PosLoginForm {
  @State() idpUrl: string = '';

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
        <input
          id="idpUrl"
          type="text"
          value={this.idpUrl}
          onInput={e => this.handleChange(e)}
          list="suggestedIssuers"
        />
        <button id="login" type="submit" disabled={!this.canSubmit}>
          Login
        </button>
        <datalist id="suggestedIssuers">
          <option value="https://solidcommunity.net">solidcommunity.net</option>
          <option value="https://solidweb.org">solidweb.org</option>
          <option value="https://solidweb.me">solidweb.me</option>
          <option value="https://inrupt.net">inrupt.net</option>
          <option value="https://login.inrupt.com">Inrupt PodSpaces</option>
          <option value="https://trinpod.us">trinpod.us</option>
          <option value="https://use.id">use.id</option>
          <option value="https://solid.redpencil.io">redpencil.io</option>
          <option value="https://datapod.grant.io">Data Pod (grant.io)</option>
          <option value="https://teamid.live">teamid.live</option>
        </datalist>
      </form>
    );
  }

  handleChange(event) {
    this.validate();
    this.idpUrl = event.target.value;
  }

  async handleSubmit() {
    this.idpUrlSelected.emit(this.idpUrl);
  }
}
