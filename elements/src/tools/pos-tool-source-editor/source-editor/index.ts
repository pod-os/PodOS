import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

export class SourceEditor {
  constructor(target: HTMLElement, content: string) {
    new EditorView({
      doc: content,
      parent: target,
      extensions: [
        basicSetup,
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.contentAttributes.of({ tabindex: '0' }),
      ],
    });
  }
}
