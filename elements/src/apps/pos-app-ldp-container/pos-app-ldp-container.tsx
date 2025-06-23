import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-app-ldp-container',
  shadow: true,
  styleUrl: 'pos-app-ldp-container.css',
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
