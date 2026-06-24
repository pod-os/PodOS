import { vi } from 'vitest';
import { describe, expect, h, it, render } from '@stencil/vitest';
import { waitFor } from '@testing-library/dom';
import { server } from '../../test/msw';
import { http, HttpResponse } from 'msw';

describe('pos-image', () => {
  it('renders img after successfully loading image data', async () => {
    // given, a jpeg image is hosted at https://pod.example/image.jpg
    const jpgResponse = HttpResponse.text('fake image data');
    jpgResponse.headers.set('Content-Type', 'image/jpg');
    const jpgBlob = await jpgResponse.blob();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake-object-url');
    server.use(
      http.get('https://pod.example/image.jpg', async () => {
        return jpgResponse;
      }),
    );

    // when a PodOS app is using a pos-image pointing to that URL
    const page = await render(
      <pos-app>
        <pos-image src="https://pod.example/image.jpg" />
      </pos-app>,
    );

    // then the pos-image renders an img element
    await waitFor(() => {
      const image = page.root.querySelector('pos-image');
      expect(image).toBeInTheDocument();
      const img = image!.shadowRoot!.querySelector('img');
      expect(img).toBeInTheDocument();
    });

    // and an object URL has been created from the jpeg blob
    expect(URL.createObjectURL).toHaveBeenCalledWith(jpgBlob);

    // and img tag uses the object URL as src
    expect(page.root).toMatchInlineSnapshot(`
      <pos-app class="hydrated">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
        <pos-image class="hydrated">
          <mock:shadow-root>
            <img src="blob:fake-object-url">
          </mock:shadow-root>
        </pos-image>
      </pos-app>
    `);
  });
});
