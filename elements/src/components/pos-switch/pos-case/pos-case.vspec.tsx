import { describe, expect, it, render, h } from '@stencil/vitest';

import './pos-case';
import { ELSE_RULE } from '../rules';

describe('pos-case', () => {
  it('contains only templates initially', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    expect(page.root).toEqualHtml(`
      <pos-case if-typeof="http://schema.org/Recipe" class="hydrated">
        <template></template>
      </pos-case>
    `);
  });

  it('renders empty by default', async () => {
    const page = await render(
      <pos-case if-typeof="http://schema.org/Recipe">
        <template>
          <div>Test</div>
        </template>
      </pos-case>,
    );
    const el: HTMLElement = page.root as unknown as HTMLElement;
    expect(el.textContent).toEqualHtml('');
  });

  it('displays error on missing template', async () => {
    const page = await render(<pos-case></pos-case>);
    const el: HTMLElement = page.root as unknown as HTMLElement;

    expect(el.textContent).toEqual('No template element found');
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

    it('can negate a rule with not', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case not if-typeof="http://schema.org/Recipe">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
        not: true,
      });
    });

    it('provides else if-typeof', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case else if-typeof="http://schema.org/Recipe">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
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
          ['eq', 'gt'].flatMap(operator => [
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

    it('provides else if-property', async () => {
      const page = await render<HTMLPosCaseElement>(
        <pos-case else if-property="http://schema.org/image">
          <template>
            <div>Test</div>
          </template>
        </pos-case>,
      );
      const rule = await page.root.getRule();
      expect(rule).toEqual({
        type: 'if-property',
        value: 'http://schema.org/image',
        else: true,
      });
    });

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
