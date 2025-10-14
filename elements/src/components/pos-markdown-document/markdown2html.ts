import { marked } from 'marked';

export async function markdown2html(markdown: string) {
  return await marked(markdown);
}
