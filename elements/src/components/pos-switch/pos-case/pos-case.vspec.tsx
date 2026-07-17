import { describe, expect, it, render, h } from '@stencil/vitest';

import './pos-case';
import { ELSE_RULE } from '../rules';

describe('pos-case', () => {
  it('renders template when active', async () => {
    const page = await render(
      <pos-case active if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    expect(page.root.innerHTML).toEqual('<div>Test</div>');
  });

  it('renders nothing when inactive', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    expect(page.root.innerHTML).toEqual('');
  });

  it('renders template after being activated', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    expect(page.root.innerHTML).toEqual('');
    page.root.setAttribute('active', '');
    await page.waitForChanges();
    expect(page.root.innerHTML).toEqual('<div>Test</div>');
  });

  it('renders empty by default', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    expect(page.root.innerHTML).toEqualHtml('');
  });

  describe('rules', () => {
    it('provides the if-typeof rule', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case if-typeof="http://schema.org/Recipe">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      });
    });

    it.each(['if-typeof', 'if-rev', 'if-property'])('can negate %s with not', async ruleType => {
      const page = await render<HTMLPosCaseElement>(
        `<pos-case not ${ruleType}="https://vocab.test#something">
          <template>
            <div>Test</div>
          </template>
        </pos-case>`,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: ruleType,
        value: 'https://vocab.test#something',
        not: true,
      });
    });

    it.each(['if-typeof', 'if-property', 'if-rev'])('provides else %s', async ruleType => {
      const page = await render<HTMLPosCaseElement>(
        `<pos-case else ${ruleType}="https://vocab.test#something">
          <template>
            <div>Test</div>
          </template>
        </pos-case>`,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: ruleType,
        value: 'https://vocab.test#something',
        else: true,
      });
    });

    it('provides the if-property rule', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case if-property="http://schema.org/image">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-property',
        value: 'http://schema.org/image',
      });
    });

    it.each(
      ['if-property', 'if-rev'].flatMap(ruleName =>
        ['some', 'every'].flatMap(semantic =>
          ['eq', 'gt', 'gte', 'lt', 'lte'].flatMap(operator => [
            {
              appliedProps: {
                ruleName,
                comparisonName: `${semantic}-value-${operator}`,
              },
              expectedComparison: {
                semantic,
                operator: operator,
              },
            },
          ]),
        ),
      ),
    )(
      'provides the $appliedProps.ruleName rule with $appliedProps.comparisonName comparison',
      async ({ appliedProps, expectedComparison }) => {
        const ruleName = appliedProps.ruleName;
        const comparisonName = appliedProps.comparisonName;
        const foo = `${ruleName}="http://schema.org/name" ${comparisonName}="Alice"`;
        const page = await render<HTMLPosCaseElement>(
          `<pos-case ${foo}>
          <template>
            <div>Test</div>
          </template>
        </pos-case>`,
        );
        const rule = await page.root.getRule();
        expect(rule).toEqual({
          type: ruleName,
          value: 'http://schema.org/name',
          comparison: {
            ...expectedComparison,
            target: 'Alice',
          },
        });
      },
    );

    it('provides the if-rev rule', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case if-rev="http://schema.org/image">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-rev',
        value: 'http://schema.org/image',
      });
    });

    it('provides the else if-rev rule', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case else if-rev="http://schema.org/image">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-rev',
        value: 'http://schema.org/image',
        else: true,
      });
    });

    it('provides else rule', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case else>
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual(ELSE_RULE);
    });
  });
});
