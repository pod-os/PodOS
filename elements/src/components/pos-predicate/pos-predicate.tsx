import { Component, h, Prop, State } from '@stencil/core';

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
          <button aria-label={`collapse URI to ${this.label}`} onClick={() => (this.expanded = false)}>
            <ion-icon name="chevron-back-circle-outline"></ion-icon>
          </button>
        </div>
      );
    } else {
      return (
        <button onClick={() => (this.expanded = true)} title={this.uri}>
          {this.label}
        </button>
      );
    }
  }
}
