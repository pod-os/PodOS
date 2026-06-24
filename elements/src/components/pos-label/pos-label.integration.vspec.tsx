import { describe, expect, h, it, render } from '@stencil/vitest';
import { notFound, server, turtleFile } from '../../test/msw';

describe('pos-label', () => {
  it('renders label for successfully loaded resource', async () => {
    // given
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );

    // when
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-label />
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then
    const label = page.root.querySelector('pos-label');
    expect(label!.shadowRoot).toEqualHtml('Jane Doe');
  });

  it('renders nothing while loading, then updates and shows the loaded label', async () => {
    // given a resource with a name, but loading takes a while
    let finishLoading: () => void;
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> <http://schema.org/name> "Jane Doe" .
        `,
        {
          delayedUntil: new Promise<void>(resolve => (finishLoading = resolve)),
        },
      ),
    );

    // when a pos-label for the resource is rendered
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-label />
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then it shows nothing at first
    const label = page.root.querySelector('pos-label');
    expect(label!.shadowRoot).toEqualHtml('');

    // but when the loading finishes
    finishLoading!();
    await page.waitForChanges();

    // then the name shows up
    expect(label!.shadowRoot).toEqualHtml('Jane Doe');
  });

  it('renders nothing when resource loading failed', async () => {
    // given a resource that fails to load
    server.use(notFound('https://janedoe.test/profile/card'));

    // when a pos-label for the resource is rendered
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-label />
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then it shows nothing at first
    const label = page.root.querySelector('pos-label');
    expect(label!.shadowRoot).toEqualHtml('');
  });

  it('updates when resource changes', async () => {
    // given Alice and Bob have a profile with their name
    server.use(
      turtleFile(
        'https://alice.test/profile/card',
        `
          <#me> <http://schema.org/name> "Alice" .
        `,
      ),
      turtleFile(
        'https://bob.test/profile/card',
        `
          <#me> <http://schema.org/name> "Bob" .
        `,
      ),
    );

    // when pos-label is rendered for Alice's profile
    const page = await render(
      <pos-app>
        <pos-resource uri="https://alice.test/profile/card#me">
          <pos-label />
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then Alice's name shows up
    const label = page.root.querySelector('pos-label');
    expect(label!.shadowRoot).toEqualHtml('Alice');

    // but when the resources uri is changed to Bob's profile
    const resource = page.root.querySelector('pos-resource');
    expect(resource).toBeInTheDocument();
    resource!.setAttribute('uri', 'https://bob.test/profile/card#me');
    await page.waitForChanges();

    // then Bob's name shows up
    expect(label!.shadowRoot).toEqualHtml('Bob');
  });
});
