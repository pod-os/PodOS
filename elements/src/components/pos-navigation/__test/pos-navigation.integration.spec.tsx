import { beforeEach, describe, expect, h, it, render, RenderResult } from '@stencil/vitest';
import { authenticatedUser, server, turtleFile } from '../../../test/msw';
import { waitFor } from '@testing-library/dom';

import { getAllByShadowRole, getByShadowPlaceholderText, getByShadowRole } from 'shadow-dom-testing-library';
import { userEvent } from '@testing-library/user-event';

describe('pos-navigation', () => {
  beforeEach(() => {
    server.use(
      ...authenticatedUser('https://alice.test/profile/card#me'),
      turtleFile(
        'https://alice.test/profile/card',
        `
          <#me> <http://www.w3.org/ns/solid/terms#privateLabelIndex> <privateLabelIndex.ttl> .
        `,
      ),
      turtleFile(
        'https://alice.test/profile/privateLabelIndex.ttl',
        `
          <https://alice.test/something#it> <http://www.w3.org/2000/01/rdf-schema#label> "Test found it" .
        `,
      ),
    );
  });

  it('an authenticated user can find things from their label index', async () => {
    const page = await render(
      <pos-app>
        <pos-navigation></pos-navigation>
      </pos-app>,
    );

    await searchFor(page, 'test');

    const suggestions = await waitForSuggestions(page, 1);
    expect(suggestions[0]).toHaveTextContent('Test found italice.test');
  });
});

async function searchFor(page: RenderResult, text: string) {
  const button = getByShadowRole(page.root, 'button', { name: 'Search or enter URI' });
  await userEvent.click(button);
  const input = getByShadowPlaceholderText(page.root, 'Search or enter URI');
  await userEvent.type(input, text);
}

async function waitForSuggestions(page: RenderResult, count: number) {
  let suggestions: Element[] = [];
  await waitFor(() => {
    suggestions = getAllByShadowRole(page.root, 'option');
    expect(suggestions).toHaveLength(count);
  });
  return suggestions;
}
