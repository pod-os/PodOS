import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-app-rdf-document',
  styleUrls: ['../styles/default-app-layout.css', '../styles/article-card.css'],
  shadow: true,
})
export class PosAppRdfDocument {
  render() {
    return (
      <Host>
        <section>
          <pos-subjects />
        </section>
        <section>
          <article aria-labelledby="doc-title">
            <header>
              <h1 id="doc-title">
                <pos-label />
              </h1>
              <pos-type-badges />
            </header>
            <pos-literals />
          </article>
        </section>
      </Host>
    );
  }
}
