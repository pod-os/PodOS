import { describe, expect, h, it, render } from '@stencil/vitest';
import { jpeg, notFound, server, turtleFile } from '../../test/msw';
import { waitFor } from '@testing-library/dom';
import { deepQuerySelector } from 'shadow-dom-testing-library';

describe('pos-picture', () => {
  it('renders the picture of a person', async () => {
    // Given Jane has a name and a picture in her profile
    server.use(
      jpeg('https://janedoe.test/profile/image.png', 'profile-pic'),
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" ;
                  <http://schema.org/image> <image.png> .
        `,
      ),
    );

    // when a page renders a pos-picture for Jane
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-picture></pos-picture>
        </pos-resource>
      </pos-app>,
    );

    // and the loading finished
    await waitFor(() => {
      const loadingIndicator = deepQuerySelector(page.root, 'sl-skeleton')!;
      expect(loadingIndicator).not.toBeInTheDocument();
    });

    // then an img element shows the profile picture blob and her name as alt text
    const image = deepQuerySelector(page.root, 'img')!;
    expect(image).toMatchInlineSnapshot(`
        <img
          alt="Jane Doe"
          src="blob:profile-pic"
        />
    `);
  });

  it('renders no picture if none is present', async () => {
    // Given Jane has a name but no picture in her profile
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );

    // when a page renders a pos-picture for Jane
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-picture></pos-picture>
        </pos-resource>
      </pos-app>,
    );

    // then no picture shows up
    const noPicture = deepQuerySelector(page.root, '.no-picture')!;
    expect(noPicture).toBeInTheDocument();
  });

  it('renders no picture if loading failed', async () => {
    // Given Jane has a name but her picture is broken
    server.use(
      notFound('https://janedoe.test/profile/image.png'),
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Jane Doe" ;
                  <http://schema.org/image> <image.png> .
        `,
      ),
    );

    // when a page renders a pos-picture for Jane
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-picture></pos-picture>
        </pos-resource>
      </pos-app>,
    );

    // and the loading finished
    await waitFor(() => {
      const loadingIndicator = deepQuerySelector(page.root, 'sl-skeleton')!;
      expect(loadingIndicator).not.toBeInTheDocument();
    });

    // then an error shows up
    expect(page.root).toHaveTextContent('Not Found');
    expect(page.root).toHaveTextContent('404');
  });
});
