import { PodOS } from '@pod-os/core';
import { Term } from '@pod-os/core/types/terms';
import { Component, Event, EventEmitter, h, Host, State, Watch } from '@stencil/core';
import { PodOsAware, PodOsEventEmitter, subscribePodOs } from '../events/PodOsAware';

@Component({
  tag: 'pos-select-term',
  styleUrl: 'pos-select-term.css',
  shadow: true,
})
export class PosSelectTerm implements PodOsAware {
  @State() os: PodOS;

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
        <input list="terms" placeholder="Type to search..." onChange={ev => this.handleChange(ev)}></input>
        <datalist id="terms">
          {this.terms.map(term => (
            <option value={term.uri}>{term.shorthand}</option>
          ))}
        </datalist>
      </Host>
    );
  }
}
