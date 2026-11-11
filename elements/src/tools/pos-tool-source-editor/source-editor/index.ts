import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';

export class SourceEditor {
  constructor(target: HTMLElement) {
    new EditorView({
      doc: 'TODO: show real document content',
      parent: target,
      extensions: [basicSetup],
    });
  }
}
