import { Component, h, Prop, State } from '@stencil/core';

import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

/**
 * Displays an RDF term (predicate) in a human-friendly way, using a provided label. The user can still expand the label
 * to the full URI to see the actual predicate.
 *
 * This will only show the predicate itself, not any value. If you want to display a value, use [pos-value](../pos-value) instead.
 */
@Component({
  tag: 'pos-predicate',
  shadow: true,
  styleUrl: './pos-predicate.css',
})
export class PosPredicate {
  /**
   * The full URI of the predicate
   */
  @Prop()
  uri: string;

  /**
   * The human-readable label to show for this predicate
   */
  @Prop()
  label: string;

  @State()
  expanded: boolean = false;

  render() {
    if (this.expanded) {
      return (
        <div class="container">
          <a href={this.uri}>{this.uri}</a>
          <sl-tooltip content={`Collapse URI`}>
            <button aria-label={`collapse URI to ${this.label}`} onClick={() => (this.expanded = false)}>
              <sl-icon name="arrow-left-circle"></sl-icon>
            </button>
          </sl-tooltip>
        </div>
      );
    } else {
      return (
        <sl-tooltip content={`${this.uri}`}>
          <button onClick={() => (this.expanded = true)}>{this.label}</button>
        </sl-tooltip>
      );
    }
  }
}
