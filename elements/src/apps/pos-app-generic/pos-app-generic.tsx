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
          <div class="card">
            <header>
              <pos-picture />
              <h1>
                <pos-label />
              </h1>
              <pos-type-badges />
            </header>
            <main>
              <pos-description />
            </main>
          </div>
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
