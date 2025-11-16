import { selectIconForTypes } from './selectIconForTypes';

describe('select icon for types', () => {
  it('selects a folder icon for containers', () => {
    const icon = selectIconForTypes([
      {
        uri: 'http://www.w3.org/ns/ldp#Resource',
        label: 'irrelevant here',
      },
      {
        uri: 'http://www.w3.org/ns/ldp#Container',
        label: 'irrelevant here',
      },
    ]);
    expect(icon).toEqual('folder2');
  });

  it('selects a file icon for other ldp resources', () => {
    const icon = selectIconForTypes([
      {
        uri: 'http://www.w3.org/ns/ldp#Resource',
        label: 'irrelevant here',
      },
    ]);
    expect(icon).toEqual('file-earmark');
  });

  it('selects question mark icon if types are empty', () => {
    const icon = selectIconForTypes([]);
    expect(icon).toEqual('question-diamond');
  });
});
