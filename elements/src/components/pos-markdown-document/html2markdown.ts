import TurndownService from 'turndown';

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

export function html2markdown(html: string): string {
  return turndown.turndown(html);
}
