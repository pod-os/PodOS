import { html2markdown } from './html2markdown';

describe('html2markdown', () => {
  it('does not change plain text', () => {
    const result = html2markdown('plain text');
    expect(result).toEqual('plain text');
  });

  it('transforms a paragraph to plain text', () => {
    const result = html2markdown('<p>plain text</p>');
    expect(result).toEqual('plain text');
  });

  it('transforms a heading to markdown using # characters', () => {
    const result = html2markdown('<h2>heading</h2>');
    expect(result).toEqual('## heading');
  });

  it('transforms a list to markdown using - characters', () => {
    const result = html2markdown('<ul><li>list item</li></ul>');
    expect(result).toEqual('-   list item');
  });

  it('transforms strong text to markdown using ** characters', () => {
    const result = html2markdown('<strong>bold</strong>');
    expect(result).toEqual('**bold**');
  });

  it('transforms em text to markdown using _ characters', () => {
    const result = html2markdown('<em>emphasis</em>');
    expect(result).toEqual('_emphasis_');
  });

  it('transforms inline code using `', () => {
    const result = html2markdown('<code>variable name</code>');
    expect(result).toEqual('`variable name`');
  });

  it('transforms code blocks using ```', () => {
    const result = html2markdown('<pre><code>code block</code></pre>');
    expect(result).toEqual('```\ncode block\n```');
  });

  it('transforms links to inline links', () => {
    const result = html2markdown('<a href="file.md">other file</a>');
    expect(result).toEqual('[other file](file.md)');
  });

  it('transforms img to markdown image', () => {
    const result = html2markdown('<img alt="alt text" src="image.png" title="Image Title"/>');
    expect(result).toEqual('![alt text](image.png "Image Title")');
  });
});
