import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

import { markdown } from '@codemirror/lang-markdown';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { turtle } from './turtle-lang';
import { LanguageSupport } from '@codemirror/language';

const languages: Record<string, () => LanguageSupport> = {
  'text/markdown': markdown,
  'text/turtle': turtle,
};

export class SourceEditor {
  constructor(target: HTMLElement, content: string, contentType: string) {
    const lang = languages[contentType] ? [languages[contentType]()] : [];
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    new EditorView({
      doc: content,
      parent: target,
      extensions: [
        basicSetup,
        EditorState.readOnly.of(true),
        EditorView.editable.of(false),
        EditorView.contentAttributes.of({ tabindex: '0' }),
        ...lang,
        dark ? vscodeDark : vscodeLight,
      ],
    });
  }
}
