import { markdown2html } from './markdown2html';

describe('markdown2html', () => {
  it('creates a paragraph from plain text', async () => {
    const result = await markdown2html('plain text');
    expect(result).toEqual('<p>plain text</p>\n');
  });

  it('creates a heading from # characters', async () => {
    const result = await markdown2html('## heading');
    expect(result).toEqual('<h2>heading</h2>\n');
  });

  it('creates a list from markdown using - characters', async () => {
    const result = await markdown2html('-   list item');
    expect(result).toEqual(`<ul>
<li>list item</li>
</ul>
`);
  });

  it('creates strong text from markdown using ** characters', async () => {
    const result = await markdown2html('**bold**');
    expect(result).toEqual('<p><strong>bold</strong></p>\n');
  });

  it('creates em text from markdown using _ characters', async () => {
    const result = await markdown2html('_emphasis_');
    expect(result).toEqual('<p><em>emphasis</em></p>\n');
  });

  it('creates inline code from backticks', async () => {
    const result = await markdown2html('`variable name`');
    expect(result).toEqual('<p><code>variable name</code></p>\n');
  });

  it('creates code blocks from ```', async () => {
    const result = await markdown2html('```\ncode block\n```');
    expect(result).toEqual(`<pre><code>code block
</code></pre>
`);
  });

  it('creates links from inline links', async () => {
    const result = await markdown2html('[other file](file.md)');
    expect(result).toEqual('<p><a href="file.md">other file</a></p>\n');
  });

  it('creates img from markdown image', async () => {
    const result = await markdown2html('![alt text](image.png "Image Title")');
    expect(result).toEqual('<p><img src="image.png" alt="alt text" title="Image Title"></p>\n');
  });
});
