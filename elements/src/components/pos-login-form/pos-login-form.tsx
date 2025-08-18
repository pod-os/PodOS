import { Component, Event, EventEmitter, h, State, Watch } from '@stencil/core';

@Component({
  tag: 'pos-login-form',
  shadow: {
    delegatesFocus: true,
  },
  styleUrl: 'pos-login-form.css',
})
export class PosLoginForm {
  @State() idpUrl: string = '';

  @State() canSubmit: boolean = false;

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
        <label htmlFor="idpUrl">Please enter your Identity Provider</label>
        <input
          id="idpUrl"
          type="url"
          value={this.idpUrl}
          required={true}
          onInput={e => this.handleChange(e)}
          list="suggestedIssuers"
          placeholder="Type to search..."
        />
        <datalist id="suggestedIssuers">
          <option value="https://solidcommunity.net/">solidcommunity.net</option>
          <option value="https://solidweb.me/">solidweb.me</option>
          <option value="https://login.inrupt.com">Inrupt PodSpaces</option>
          <option value="https://trinpod.us/">trinpod.us</option>
          <option value="https://trinpod.eu/">trinpod.eu</option>
          <option value="https://solid.redpencil.io/">redpencil.io</option>
          <option value="https://teamid.live/">teamid.live</option>
        </datalist>
        <input id="login" type="submit" value="Login" disabled={!this.canSubmit} />
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
