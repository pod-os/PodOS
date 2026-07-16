import { describe, expect, h, it, render } from '@stencil/vitest';
import { server, turtleFile } from '../../test/msw';

describe('pos-switch', () => {
  it('renders matching if-type and if-property cases', async () => {
    // given a person with a name
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ; <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );

    // when a pos-switch with cases for type Person and property name
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

    // then both cases are rendert, but the else case is hidden
    expect(page.root).toEqualText('They are a person\nand they have a name!');
  });

  it('renders the cases matching the property value in question', async () => {
    // given a person named Jane Doe
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ; <http://schema.org/name> "Jane Doe" .
        `,
      ),
    );
    // when a pos-switch has cases for name="Jane Doe" and name="Someone else"
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-switch>
            <pos-case if-property="http://schema.org/name" every-value-eq="Jane Doe">
              <template>Hi Jane, how are you?</template>
            </pos-case>
            <pos-case else if-property="http://schema.org/name" every-value-eq="Someone else">
              <template>Who are you?</template>
            </pos-case>
            <pos-case else>
              <template>Nothing else matters</template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>,
    );

    // then the case for Jane is shown
    expect(page.root).toEqualText('Hi Jane, how are you?');
  });
});
