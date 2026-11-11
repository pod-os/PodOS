import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';

export class SourceEditor {
  constructor(target: HTMLElement, content: string) {
    new EditorView({
      doc: content,
      parent: target,
      extensions: [basicSetup],
    });
  }
}
