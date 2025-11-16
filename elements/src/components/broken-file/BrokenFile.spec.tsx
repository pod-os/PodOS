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
            <sl-icon name="lock"></sl-icon>
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
    ${401} | ${'lock'}
    ${403} | ${'lock'}
    ${404} | ${'question-circle'}
    ${500} | ${'exclamation-circle'}
  `(`renders $iconName icon for status $code`, async ({ code, iconName }) => {
    const brokenFile = {
      url: 'https://pod.test/image.png',
      toString: () => 'error message',
      status: { code, text: 'unauthenticated' },
    } as unknown as BrokenFileData;
    const component = <BrokenFile file={brokenFile} />;
    const page = await renderFunctionalComponent(component);
    expect(page.root.querySelector('sl-icon')).toEqualAttribute('name', iconName);
  });
});
