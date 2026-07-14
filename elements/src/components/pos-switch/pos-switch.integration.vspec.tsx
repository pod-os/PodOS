import { describe, expect, h, it, render } from '@stencil/vitest';
import { server, turtleFile } from '../../test/msw';

describe('pos-switch', () => {
  it('renders', async () => {
    // given
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ; <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );

    // when
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-switch>
            <pos-case if-typeof="http://schema.org/Person">
              <template>They are a person</template>
            </pos-case>
            <pos-case if-property="http://schema.org/name">
              <template>and they have a name!</template>
            </pos-case>
            <pos-case else>
              <template>Nothing else matters</template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>,
    );
    await page.waitForChanges();

    // then
    expect(page.root).toHaveTextContent('They are a person\nand they have a name!');
  });
});
