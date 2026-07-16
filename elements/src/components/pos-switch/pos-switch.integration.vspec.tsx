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

  it('re-evaluates cases after the resource changed', async () => {
    // given a person named Alice
    server.use(
      turtleFile(
        'https://alice.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ; <http://schema.org/name> "Alice" .
        `,
      ),
      turtleFile(
        'https://bob.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ; <http://schema.org/name> "Bob" .
        `,
      ),
      turtleFile(
        'https://someone.test/profile/card',
        `
          <#me> a <http://schema.org/Person> .
        `,
      ),
    );
    // and a pos-switch is set up to greet people depending on the available data
    const page = await render(
      <pos-app>
        <pos-resource uri="https://alice.test/profile/card#me">
          <pos-switch>
            <pos-case if-typeof="http://schema.org/Person">
              <template>Welcome!</template>
            </pos-case>
            <pos-case if-property="http://schema.org/name" every-value-eq="Alice">
              <template>What a pleasure to see you, Alice!</template>
            </pos-case>
            <pos-case else if-property="http://schema.org/name" every-value-eq="Bob">
              <template>
                Nice to meet you! You're <pos-label></pos-label>, right?
              </template>
            </pos-case>
            <pos-case else>
              <template>Nice to meet you! What is your name?</template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>,
    );

    // then it shows the case for Alice
    const resourceElement = page.root.querySelector('pos-resource')!;
    expect(page.root).toEqualText('Welcome!\nWhat a pleasure to see you, Alice!');

    // and it updates for a differently named person
    resourceElement.setAttribute('uri', 'https://bob.test/profile/card#me');
    await page.waitForChanges();
    expect(page.root).toEqualText("Welcome!\nNice to meet you! You're Bob, right?");

    // and it updates for people without a name
    resourceElement.setAttribute('uri', 'https://someone.test/profile/card#me');
    await page.waitForChanges();
    expect(page.root).toEqualText('Welcome!\nNice to meet you! What is your name?');
  });
});
