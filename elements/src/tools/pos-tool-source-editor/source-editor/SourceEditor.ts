import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

import { markdown } from '@codemirror/lang-markdown';

export class SourceEditor {
  constructor(target: HTMLElement, content: string, contentType: string) {
    const highlighter = contentType === 'text/markdown' ? [markdown()] : [];
    new EditorView({
      doc: content,
      parent: target,
      extensions: [
        basicSetup,
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.contentAttributes.of({ tabindex: '0' }),
        ...highlighter,
      ],
    });
  }
}
