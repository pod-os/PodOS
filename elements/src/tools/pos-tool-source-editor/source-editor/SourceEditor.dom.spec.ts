import { beforeEach, describe, expect, it } from '@stencil/vitest';
import { SourceEditor } from './SourceEditor';
import { getByRole } from '@testing-library/dom';

describe('SourceEditor', () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement('div');
  });

  it('renders markdown with highlighting', () => {
    new SourceEditor(root, '# Markdown', 'text/markdown');
    const textbox = getByRole(root, 'textbox');
    expect(textbox).toHaveTextContent('# Markdown');
    expect(textbox).toEqualAttribute('data-language', 'markdown');
  });

  it('renders turtle with highlighting', () => {
    new SourceEditor(root, '<> <> <> .', 'text/turtle');
    const textbox = getByRole(root, 'textbox');
    expect(textbox).toHaveTextContent('<> <> <> .');
    expect(textbox).toEqualAttribute('data-language', 'turtle');
  });

  it('renders other content types without highlighting', () => {
    new SourceEditor(root, 'Anything else', 'data/anything');
    const textbox = getByRole(root, 'textbox');
    expect(textbox).toHaveTextContent('Anything else');
    expect(textbox).not.toHaveAttribute('data-language');
  });
});
