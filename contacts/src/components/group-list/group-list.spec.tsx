import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';

import { getByRole } from '@testing-library/dom';
import { GroupList } from './group-list';

describe('group-list', () => {
  it('renders an empty list without groups', async () => {
    const page = await newSpecPage({
      components: [GroupList],
      template: () => <pos-contacts-group-list groups={[]}></pos-contacts-group-list>,
      supportsShadowDom: false,
    });

    const list = getByRole(page.root, 'list');
    expect(list).toEqualHtml('<ul></ul>');
  });

  it('renders an list of groups', async () => {
    const page = await newSpecPage({
      components: [GroupList],
      template: () => (
        <pos-contacts-group-list
          groups={[
            { uri: 'https://group1.test', name: 'Group 1' },
            { uri: 'https://group2.test', name: 'Group 2' },
          ]}
        ></pos-contacts-group-list>
      ),
      supportsShadowDom: false,
    });

    const list = getByRole(page.root, 'list');
    expect(list).toEqualHtml(`
      <ul>
        <li>
          <a href='https://group1.test'>
            Group 1
          </a>
        </li>
        <li>
          <a href="https://group2.test">
            Group 2
          </a>
        </li>
      </ul>
    `);
  });
});
