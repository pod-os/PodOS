import { describe, expect, h, it, render } from '@stencil/vitest';
import { forever, notFound, server, turtleFile } from '../../test/msw';
import { deepQuerySelector } from 'shadow-dom-testing-library';

describe('pos-resource', () => {
  it('renders a pos-label for the resource', async () => {
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-label></pos-label>
        </pos-resource>
      </pos-app>,
    );
    expect(page.root).toEqualText('Jane Doe');
    const loadingIndicator = deepQuerySelector(page.root, 'sl-progress-bar');
    expect(loadingIndicator).not.toBeInTheDocument();
  });

  it('renders a loading indicator and no label while loading', async () => {
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" .
        `,
        { delayedUntil: forever },
      ),
    );
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <h1>
            <pos-label></pos-label>
          </h1>
        </pos-resource>
      </pos-app>,
    );
    const loadingIndicator = deepQuerySelector(page.root, 'sl-progress-bar');
    expect(loadingIndicator).toBeInTheDocument();
    expect(page.root).toEqualText('');
  });

  it('renders a error and no label when loading failed', async () => {
    server.use(notFound('https://janedoe.test/profile/card'));
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <h1>
            <pos-label></pos-label>
          </h1>
        </pos-resource>
      </pos-app>,
    );
    expect(page.root).toHaveTextContent('Sorry, something went wrong');
    expect(page.root).toHaveTextContent('404');
    expect(page.root).toHaveTextContent('Not Found');
    expect(page.root).toHaveTextContent('Fetcher: <https://janedoe.test/profile/card>');
  });

  it('re-renders after lazy resource has been fetched', async () => {
    // Given a profile with a name
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );

    // and pos-resource showing a label for that resource
    // but without fetching the resource yet (lazy)
    const page = await render(
      <pos-app>
        <pos-resource lazy uri="https://janedoe.test/profile/card#me">
          <pos-label></pos-label>
        </pos-resource>
      </pos-app>,
    );

    // and therefore it shows the default label at first
    expect(page.root).toEqualText('card#me');
    const resource = page.root.querySelector('pos-resource')!;

    // when the resource is explicitly fetched
    await resource.fetch();

    // then the page updates to show the fetched label
    await page.waitForChanges();
    expect(page.root).toEqualText('Jane Doe');
  });

  it('shows the error if a lazily fetched resource fails to load', async () => {
    // Given broken resource
    server.use(notFound('https://janedoe.test/profile/card'));

    // and pos-resource showing a label for that resource
    // but without fetching the resource yet (lazy)
    const page = await render(
      <pos-app>
        <pos-resource lazy uri="https://janedoe.test/profile/card#me">
          <pos-label></pos-label>
        </pos-resource>
      </pos-app>,
    );

    // and therefore it shows the default label at first
    expect(page.root).toEqualText('card#me');
    const resource = page.root.querySelector('pos-resource')!;

    // when the resource is explicitly fetched
    await resource.fetch();

    // then the page updates to show the error
    await page.waitForChanges();
    expect(page.root).toHaveTextContent('Sorry, something went wrong');
  });

  it('replaces the error with the label when a subsequent fetch succeeds', async () => {
    // Given a profile first fails to load
    server.use(
      notFound('https://janedoe.test/profile/card', { once: true }),
      // but a later fetch returns a name
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" .
        `,
        { once: true },
      ),
    );
    // when a page has a pos-resource and a label for that resource
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <h1>
            <pos-label></pos-label>
          </h1>
        </pos-resource>
      </pos-app>,
    );
    // then it shows an error at first
    expect(page.root).toHaveTextContent('Sorry, something went wrong');
    const resource = page.root.querySelector('pos-resource')!;

    // but when fetched again
    await resource.fetch();

    // then the page updates to show the newly fetched name
    await page.waitForChanges();
    expect(page.root).toHaveTextContent('Jane Doe');
  });
});
