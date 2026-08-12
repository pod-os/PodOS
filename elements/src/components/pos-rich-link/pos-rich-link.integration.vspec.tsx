import { server, turtleFile } from '../../test/msw';
import { render, h, describe, beforeEach, it, expect } from '@stencil/vitest';
import { waitFor } from '@testing-library/dom';

describe('pos-rich-link', () => {
  beforeEach(() => {
    server.use(
      turtleFile(
        'https://resource.test',
        `
          <> <https://schema.org/name> "Test Label";
              <https://schema.org/description> "Test Description";
              <https://schema.org/video> <#video-1>;
          .
          <#video-1>
              <https://schema.org/name> "Video 1";
              <https://schema.org/description> "Description of Video 1";
          .
        `,
      ),
    );
  });

  it('can be used outside resource', async () => {
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test"></pos-resource>
        <pos-rich-link uri="https://resource.test" />
      </pos-app>,
    );

    const link = page.root?.querySelector('pos-rich-link');
    await waitFor(() => {
      expect(link).toHaveTextContent('Test Labelresource.testTest Description');
    });
    expect(link).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <pos-resource class="hydrated">
            <mock:shadow-root>
              <slot></slot>
            </mock:shadow-root>
            <p class="content">
              <a href="https://resource.test">
                <pos-label class="hydrated">
                  <mock:shadow-root>
                    Test Label
                  </mock:shadow-root>
                </pos-label>
              </a>
              <span class="url">
                resource.test
              </span>
              <pos-description class="hydrated">
                <mock:shadow-root>
                  Test Description
                </mock:shadow-root>
              </pos-description>
            </p>
          </pos-resource>
        </mock:shadow-root>
      </pos-rich-link>
    `);
  });

  it('receives and renders resource', async () => {
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test">
          <pos-rich-link />
        </pos-resource>
      </pos-app>,
    );
    const link = page.root?.querySelector('pos-rich-link');
    await waitFor(() => {
      expect(link).toHaveTextContent('Test Labelresource.testTest Description');
    });
    expect(link).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <p class="content">
            <a href="https://resource.test">
              <pos-label class="hydrated">
                <mock:shadow-root>
                  Test Label
                </mock:shadow-root>
              </pos-label>
            </a>
            <span class="url">
              resource.test
            </span>
            <pos-description class="hydrated">
              <mock:shadow-root>
                Test Description
              </mock:shadow-root>
            </pos-description>
          </p>
        </mock:shadow-root>
      </pos-rich-link>
    `);
  });

  it('uses label and description of the matching rel', async () => {
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test">
          <pos-rich-link rel="https://schema.org/video" />
        </pos-resource>
      </pos-app>,
    );

    const link = page.root?.querySelector('pos-rich-link');
    await waitFor(() => {
      expect(link).toHaveTextContent('Video 1resource.testDescription of Video 1');
    });
    expect(link).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <pos-resource class="hydrated">
            <mock:shadow-root>
              <slot></slot>
            </mock:shadow-root>
            <p class="content">
              <a href="https://resource.test#video-1">
                <pos-label class="hydrated">
                  <mock:shadow-root>
                    Video 1
                  </mock:shadow-root>
                </pos-label>
              </a>
              <span class="url">
                resource.test
              </span>
              <pos-description class="hydrated">
                <mock:shadow-root>
                  Description of Video 1
                </mock:shadow-root>
              </pos-description>
            </p>
          </pos-resource>
        </mock:shadow-root>
      </pos-rich-link>
    `);
  });

  it('uses label and description of the matching rev', async () => {
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test#video-1">
          <pos-rich-link rev="https://schema.org/video" />
        </pos-resource>
      </pos-app>,
    );

    const link = page.root?.querySelector('pos-rich-link');
    await waitFor(() => {
      expect(link).toHaveTextContent('Test Labelresource.testTest Description');
    });
    expect(link).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <pos-resource class="hydrated">
            <mock:shadow-root>
              <slot></slot>
            </mock:shadow-root>
            <p class="content">
              <a href="https://resource.test">
                <pos-label class="hydrated">
                  <mock:shadow-root>
                    Test Label
                  </mock:shadow-root>
                </pos-label>
              </a>
              <span class="url">
                resource.test
              </span>
              <pos-description class="hydrated">
                <mock:shadow-root>
                  Test Description
                </mock:shadow-root>
              </pos-description>
            </p>
          </pos-resource>
        </mock:shadow-root>
      </pos-rich-link>
    `);
  });

  it('renders slotted label with received resource ', async () => {
    const page = await render(
      <pos-app>
        <pos-resource uri="https://resource.test">
          <pos-rich-link>
            <div>
              Say hello to the <pos-label></pos-label>
            </div>
          </pos-rich-link>
        </pos-resource>
      </pos-app>,
    );

    const link = page.root?.querySelector('pos-rich-link');
    await waitFor(() => {
      expect(link).toHaveTextContent('Test Label');
    });
    expect(link).toMatchInlineSnapshot(`
      <pos-rich-link class="hydrated">
        <mock:shadow-root>
          <a href="https://resource.test">
            <slot></slot>
          </a>
        </mock:shadow-root>
        <div>
          Say hello to the
          <pos-label class="hydrated">
            <mock:shadow-root>
              Test Label
            </mock:shadow-root>
          </pos-label>
        </div>
      </pos-rich-link>
    `);
  });
});
