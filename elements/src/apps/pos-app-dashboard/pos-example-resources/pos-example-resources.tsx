import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pos-example-resources',
  styleUrl: 'pos-example-resources.css',
  shadow: true,
})
export class PosExampleResources {
  render() {
    return (
      <Host>
        <div>
          <h2>Try these... 💡</h2>
          <p>No idea where to start? Try these example resources, and follow your nose 👃</p>
          <div class="links">
            <pos-rich-link uri="https://pod-os.solidcommunity.net/profile/card#me" />
            <pos-rich-link uri="https://angelo.veltens.org/profile/card#me" />
            <pos-rich-link uri="https://angelo.veltens.org/public/bookmarks" />
            <pos-rich-link uri="https://solidos.solidcommunity.net/profile/card#me" />
          </div>
        </div>
      </Host>
    );
  }
}
