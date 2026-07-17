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

  describe('rule configuration errors', () => {
    it.each([
      [
        `if-typeof="http://schema.org/Recipe"
         if-rev="http://schema.org/image"`,
      ],
      [
        `if-typeof="http://schema.org/Recipe"
         if-property="http://schema.org/image"`,
      ],
      [
        `if-rev="http://schema.org/Recipe"
         if-property="http://schema.org/image"`,
      ],
      ,
      [
        `if-typeof="http://schema.org/Recipe"
         if-rev="http://schema.org/Recipe"
         if-property="http://schema.org/image"`,
      ],
    ])('shows error if more than one rule is present', async rules => {
      const page = await render(
        `<pos-case ${rules}>
          <template>
            <div>Test</div>
          </template>
        </pos-case>`,
      );
      expect(page.root).toEqualText('At most 1 "if-" must be present');
    });

    it.each([
      // we don't check every permutation here, but at least make sure every
      // property is tested once
      [
        `some-value-eq="Alice"
         every-value-eq="Alice"`,
      ],
      [
        `some-value-gt="Alice"
         some-value-lt="Zoe"`,
      ],
      [
        `every-value-gt="Alice"
         every-value-lt="Zoe"`,
      ],
      [
        `every-value-lte="Alice"
         every-value-gte="Zoe"`,
      ],
      [
        `some-value-lte="Alice"
         some-value-gte="Zoe"`,
      ],
    ])('shows error if more than one rule is present', async comparisons => {
      const page = await render(
        `<pos-case if-property="http://schema.org/name" ${comparisons}>
          <template>
            <div>Test</div>
          </template>
        </pos-case>`,
      );
      expect(page.root).toEqualText('At most 1 comparison ("every-" / "some-") must be present');
    });
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
