import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-app-ldp-container',
  shadow: true,
  styleUrls: ['../styles/default-app-layout.css', '../styles/article-card.css'],
})
export class PosAppLdpContainer {
  render() {
    return (
      <Host>
        <section>
          <pos-container-contents />
          <details>
            <summary>All subjects</summary>
            <pos-subjects />
          </details>
        </section>
        <section>
          <article>
            <header>
              <h1>
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
