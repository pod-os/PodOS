import { vi, beforeEach, describe, expect, it } from '@stencil/vitest';
import { SourceEditor } from './SourceEditor';
import { getByRole } from '@testing-library/dom';
import { userEvent } from '@testing-library/user-event';
import { EditorSelection } from '@codemirror/state';

describe('SourceEditor', () => {
  let root: HTMLElement;
  beforeEach(() => {
    root = document.createElement('div');
  });

  it('renders markdown with highlighting', () => {
    new SourceEditor(root, { content: '# Markdown', contentType: 'text/markdown' });
    const textbox = getByRole(root, 'textbox');
    expect(textbox).toHaveTextContent('# Markdown');
    expect(textbox).toEqualAttribute('data-language', 'markdown');
  });

  it('renders turtle with highlighting', () => {
    new SourceEditor(root, { content: '<> <> <> .', contentType: 'text/turtle' });
    const textbox = getByRole(root, 'textbox');
    expect(textbox).toHaveTextContent('<> <> <> .');
    expect(textbox).toEqualAttribute('data-language', 'turtle');
  });

  it('renders other content types without highlighting', () => {
    new SourceEditor(root, { content: 'Anything else', contentType: 'data/anything' });
    const textbox = getByRole(root, 'textbox');
    expect(textbox).toHaveTextContent('Anything else');
    expect(textbox).not.toHaveAttribute('data-language');
  });

  describe('get content', () => {
    it('gets raw content', () => {
      const editor = new SourceEditor(root, { content: '# Markdown', contentType: 'text/markdown' });
      const content = editor.getContent();
      expect(content).toEqual('# Markdown');
    });
  });

  describe('editable', () => {
    it('is editable', () => {
      const editor = new SourceEditor(root, { content: '# Markdown', contentType: 'text/markdown', editable: true });
      const textbox = getByRole(root, 'textbox');
      expect(editor.isEditable()).toBe(true);
      expect(textbox).toEqualAttribute('contenteditable', 'true');
      expect(textbox).not.toHaveAttribute('aria-readonly');
    });

    it('is read-only', () => {
      const editor = new SourceEditor(root, { content: '# Markdown', contentType: 'text/markdown', editable: false });
      const textbox = getByRole(root, 'textbox');
      expect(editor.isEditable()).toBe(false);
      expect(textbox).toEqualAttribute('contenteditable', 'false');
      expect(textbox).toEqualAttribute('aria-readonly', 'true');
    });
  });

  describe('on update', () => {
    it('calls given callback on update', async () => {
      const callback = vi.fn();
      const editor = new SourceEditor(root, { content: '# Markdown', contentType: 'text/markdown' });
      editor.onUpdate(callback);
      const textbox = getByRole(root, 'textbox');
      await userEvent.type(textbox, 'updated content');
      // @ts-ignore Accessing a private field here for testing
      editor.view.dispatch({ changes: { from: 0, insert: 'updated content' } });
      expect(callback).toHaveBeenCalled();
    });

    it('does not callback on updates that do not change the content', async () => {
      const callback = vi.fn();
      const editor = new SourceEditor(root, { content: '# Markdown', contentType: 'text/markdown' });
      editor.onUpdate(callback);
      // @ts-ignore Accessing a private field here for testing
      editor.view.dispatch({ selection: EditorSelection.cursor(0) });
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
