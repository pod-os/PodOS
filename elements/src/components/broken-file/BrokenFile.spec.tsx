import { BrokenFile as BrokenFileData } from '@pod-os/core';
import { h } from '@stencil/core';
import { renderFunctionalComponent } from '../../test/renderFunctionalComponent';
import { BrokenFile } from './BrokenFile';

describe('BrokenFile', () => {
  it('renders an error block with icon, error message and link to the image url', async () => {
    const brokenFile = {
      url: 'https://pod.test/image.png',
      toString: () => 'error message',
      status: { code: 401, text: 'unauthenticated' },
    } as unknown as BrokenFileData;
    const component = <BrokenFile file={brokenFile} />;
    const page = await renderFunctionalComponent(component);
    expect(page.root).toEqualHtml(`
      <div>
        <a class="error" href="https://pod.test/image.png">
          <div>
            <ion-icon name="lock-closed-outline"></ion-icon>
          </div>
          <div class="code">
            401
          </div>
          <div class="text">
            unauthenticated
          </div>
        </a>
      </div>`);
  });

  it.each`
    code   | iconName
    ${401} | ${'lock-closed-outline'}
    ${403} | ${'lock-closed-outline'}
    ${404} | ${'help-circle-outline'}
    ${500} | ${'alert-circle-outline'}
  `(`renders $iconName icon for status $code`, async ({ code, iconName }) => {
    const brokenFile = {
      url: 'https://pod.test/image.png',
      toString: () => 'error message',
      status: { code, text: 'unauthenticated' },
    } as unknown as BrokenFileData;
    const component = <BrokenFile file={brokenFile} />;
    const page = await renderFunctionalComponent(component);
    expect(page.root.querySelector('ion-icon')).toEqualAttribute('name', iconName);
  });
});
