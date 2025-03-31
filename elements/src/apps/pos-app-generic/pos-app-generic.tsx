import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-app-generic',
  styleUrls: ['./pos-app-generic.css'],
  shadow: true,
})
export class PosAppGeneric {
  render() {
    return (
      <Host>
        <section>
          <article aria-labelledby="thing-title">
            <header>
              <pos-picture blurredBackground={true} />
              <h1 id="thing-title">
                <pos-label />
              </h1>
              <pos-type-badges />
            </header>
            <main>
              <pos-description />
            </main>
          </article>
        </section>
        <section>
          <pos-literals />
        </section>
        <section>
          <pos-relations />
          <pos-reverse-relations />
        </section>
      </Host>
    );
  }
}
