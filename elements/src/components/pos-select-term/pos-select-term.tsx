import { PodOS, Term } from '@pod-os/core';
import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-select-term',
  styleUrl: 'pos-select-term.css',
  shadow: {
    delegatesFocus: true,
  },
})
export class PosSelectTerm implements PodOsAware {
  @State() os: PodOS;

  @Prop() placeholder: string = 'Type to search...';

  @Prop() value: string = '';

  @State() terms: Term[] = [];

  @Event({ eventName: 'pod-os:init' }) subscribePodOs: PodOsEventEmitter;

  /**
   * Fires when a term is entered or selected
   */
  @Event({ eventName: 'pod-os:term-selected' }) termSelected: EventEmitter;

  componentWillLoad() {
    subscribePodOs(this);
  }

  receivePodOs = async (os: PodOS) => {
    this.os = os;
  };

  @Watch('os')
  setTerms() {
    this.terms = this.os.listKnownTerms();
  }

  handleChange(event) {
    this.termSelected.emit({ uri: event.target.value });
  }

  render() {
    return (
      <Host>
        <input
          part="input"
          list="terms"
          placeholder={this.placeholder}
          value={this.value}
          onChange={ev => this.handleChange(ev)}
        ></input>
        <datalist part="terms" id="terms">
          {this.terms.map(term => (
            <option value={term.uri}>{term.shorthand}</option>
          ))}
        </datalist>
      </Host>
    );
  }
}
