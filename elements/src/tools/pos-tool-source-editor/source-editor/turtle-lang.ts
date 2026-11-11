import { LRLanguage, LanguageSupport } from '@codemirror/language';
import { parser } from 'lezer-turtle';

const TurtleLanguage = LRLanguage.define({ parser, name: 'turtle' });
export function turtle() {
  return new LanguageSupport(TurtleLanguage);
}
