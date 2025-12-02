import { mockPodOS } from '../../test/mockPodOS';
import { newSpecPage } from '@stencil/core/testing';
import { PosTypeIndexEntries } from './pos-type-index-entries';
import { when } from 'jest-when';
import { Thing, TypeIndex, TypeRegistration } from '@pod-os/core';

describe('pos-type-index-entries', () => {
  function mockTypeIndex(typeIndex: TypeIndex) {
    const os = mockPodOS();
    const assume = jest.fn();
    when(os.store.get)
      .calledWith('https://alice.example/settings/publicTypeIndex')
      .mockReturnValue({
        assume,
      } as unknown as Thing);
    when(assume).calledWith(TypeIndex).mockReturnValue(typeIndex);
  }

  it('renders nothing if type index is empty', async () => {
    // given an empty type index
    const typeIndex = {
      listAll: jest.fn().mockReturnValue([]),
    } as unknown as TypeIndex;
    mockTypeIndex(typeIndex);

    // when the component is rendered
    const page = await newSpecPage({
      components: [PosTypeIndexEntries],
      html: `<pos-type-index-entries uri="https://alice.example/settings/publicTypeIndex"/>`,
    });

    // then it shows nothing
    expect(page.root).toEqualHtml(`
      <pos-type-index-entries uri="https://alice.example/settings/publicTypeIndex">
      </pos-type-index-entries>
    `);
  });

  it('renders a single entry', async () => {
    // given a single registration
    const registration: TypeRegistration = {
      forClass: 'http://schema.org/VideoGame',
      targets: [
        {
          uri: 'https://alice.example/games/minecraft#it',
          type: 'instance',
        },
      ],
    };
    const typeIndex = {
      listAll: jest.fn().mockReturnValue([registration]),
    } as unknown as TypeIndex;
    mockTypeIndex(typeIndex);

    // when the component is rendered
    const page = await newSpecPage({
      components: [PosTypeIndexEntries],
      html: `<pos-type-index-entries uri="https://alice.example/settings/publicTypeIndex"/>`,
    });

    // then it shows one entry
    expect(page.root).toEqualHtml(`
      <pos-type-index-entries uri="https://alice.example/settings/publicTypeIndex">
        <dl>
          <dt><pos-predicate uri="http://schema.org/VideoGame" label="http://schema.org/VideoGame"></dt>
          <dd>
            <pos-rich-link uri="https://alice.example/games/minecraft#it">
            </pos-rich-link>
          </dd>
        </dl>
      </pos-type-index-entries>
    `);
  });
});
