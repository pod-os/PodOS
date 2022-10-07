import { BrokenFile } from '@pod-os/core';
import { h } from '@stencil/core';
import { renderFunctionalComponent } from '../../test/renderFunctionalComponent';
import { BrokenImage } from './BrokenImage';

describe('BrokenImage', () => {
  it('renders an error block with icon, error message and link to the image url', async () => {
    const brokenFile = { url: 'https://pod.test/image.png', toString: () => 'error message' } as BrokenFile;
    const component = <BrokenImage file={brokenFile} />;
    const page = await renderFunctionalComponent(component);
    expect(page.root).toEqualHtml(`
      <a href="https://pod.test/image.png">
        <div class="error">
          <div>
            <ion-icon name="close-circle-outline"></ion-icon>
          </div>
          <div class="message">
            error message
          </div>
        </div>
      </a>`);
  });
});
