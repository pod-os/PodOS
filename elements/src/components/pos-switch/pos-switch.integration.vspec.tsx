import { describe, expect, h, it, render } from '@stencil/vitest';
import { server, turtleFile } from '../../test/msw';
import { waitFor } from '@testing-library/dom';
import { Store } from '@pod-os/core';
import { http, HttpResponse } from 'msw';

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
    expect(page.root).toEqualText('They are a personand they have a name!');
    const switchElement = page.root.querySelector('pos-switch');
    expect(switchElement).toEqualLightHtml(`
        <pos-switch class="hydrated">
          <pos-case if-typeof="http://schema.org/Person" innerhtml="They are a person" class="hydrated" active>
            They are a person
          </pos-case>
          <pos-case if-property="http://schema.org/name" innerhtml="and they have a name!" class="hydrated" active>
            and they have a name!
          </pos-case>
          <pos-case innerhtml class="hydrated"></pos-case>
        </pos-switch>`);
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

  it('when not is added, the cases NOT matching the property value in question are rendered', async () => {
    // given a person named Bob
    server.use(
      turtleFile(
        'https://bob.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ; <http://schema.org/name> "Bob" .
        `,
      ),
    );
    // when a pos-switch has cases for anyone NOT named "Jane Doe" and a fallback else
    const page = await render(
      <pos-app>
        <pos-resource uri="https://bob.test/profile/card#me">
          <pos-switch>
            <pos-case not if-property="http://schema.org/name" every-value-eq="Jane Doe">
              <template>
                Hi <pos-label></pos-label>, did you see Jane?
              </template>
            </pos-case>
            <pos-case else>
              <template>Hi Jane!</template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>,
    );

    // then the negated case is shown
    expect(page.root).toEqualText('Hi Bob, did you see Jane?');
  });

  it('numeric value comparison', async () => {
    // given Bob is 40 years old
    server.use(
      turtleFile(
        'https://bob.test/profile/card',
        `
          <#me> a <http://schema.org/Person> ;
                  <http://schema.org/name> "Bob";
                  <http://schema.org/age> 40 .
        `,
      ),
    );
    // when a pos-switch has cases for different age ranges
    const page = await render(
      <pos-app>
        <pos-resource uri="https://bob.test/profile/card#me">
          <pos-switch>
            <pos-case if-property="http://schema.org/age" every-value-gte="18">
              <template>
                <pos-label></pos-label> is a grown up.
              </template>
            </pos-case>
            <pos-case if-property="http://schema.org/age" every-value-gte="21">
              <template>Even in the US.</template>
            </pos-case>
            <pos-case if-property="http://schema.org/age" every-value-lt="60">
              <template>
                <pos-label></pos-label> is not older than 60.
              </template>
            </pos-case>
            <pos-case if-property="http://schema.org/age" every-value-eq="40">
              <template>
                <pos-label></pos-label> is exactly 40 years old!
              </template>
            </pos-case>
            <pos-case if-property="http://schema.org/age" every-value-gt="99">
              <template>
                <pos-label></pos-label> must be really wise.
              </template>
            </pos-case>
            <pos-case if-property="http://schema.org/age" every-value-lt="6">
              <template>
                Hello little <pos-label></pos-label>.
              </template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>,
    );
    expect(page.root).toEqualText(
      `Bob is a grown up.Even in the US.Bob is not older than 60.Bob is exactly 40 years old!`,
    );
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
    expect(page.root).toEqualText('Welcome!What a pleasure to see you, Alice!');

    // and it updates for a differently named person
    resourceElement.setAttribute('uri', 'https://bob.test/profile/card#me');
    await page.waitForChanges();
    expect(page.root).toEqualText("Welcome!Nice to meet you! You're Bob, right?");

    // and it updates for people without a name
    resourceElement.setAttribute('uri', 'https://someone.test/profile/card#me');
    await page.waitForChanges();
    expect(page.root).toEqualText('Welcome!Nice to meet you! What is your name?');
  });

  it('updates the cases after matching data was added', async () => {
    let store: Store;
    document.addEventListener('pod-os:loaded', evt => {
      store = (evt as CustomEvent).detail.os.store;
    });

    // given a person without a name
    server.use(
      turtleFile(
        'https://janedoe.test/profile/card',
        `
          <#me> a <http://schema.org/Person> .
        `,
      ),
      // but the profile document can be patched to add a name
      http.patch('https://janedoe.test/profile/card', async () => {
        return HttpResponse.text();
      }),
    );
    // and a pos-switch is rendered asking users for a name or greeting them
    const page = await render(
      <pos-app>
        <pos-resource uri="https://janedoe.test/profile/card#me">
          <pos-switch>
            <pos-case not if-property="http://schema.org/name">
              <template>Please tell me your name</template>
            </pos-case>
            <pos-case else>
              <template>
                Hi, <pos-label></pos-label>
              </template>
            </pos-case>
          </pos-switch>
        </pos-resource>
      </pos-app>,
    );
    // and we got the PodOS store from the page
    await waitFor(() => {
      expect(store).toBeDefined();
    });

    // and the "tell me your name" case is shown at first
    expect(page.root).toEqualText('Please tell me your name');

    // when the user adds their name
    const resource = store!.get('https://janedoe.test/profile/card#me');
    await store!.addPropertyValue(resource!, 'http://schema.org/name', 'Jane Doe');

    // then the page updates to greet them
    await waitFor(() => {
      expect(page.root).toEqualText('Hi, Jane Doe');
    });
  });
});
