import { describe, expect, it } from '@stencil/vitest';
import { doValuesMatch } from './doValuesMatch';
import { Operator, Semantic } from './index';

describe('do values match', () => {
  describe.each([[['Alice', 'Bob', 'Claire']], [['99', '100', '101']]])('given %s', list => {
    const less = list[0];
    const target = list[1];
    const greater = list[2];

    it.each([
      ...['eq', 'gt', 'lt', 'gte', 'lte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [],
        match: false,
      })),
      ...['gt', 'gte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [greater],
        match: true,
      })),
      ...['eq', 'lt', 'lte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [greater],
        match: false,
      })),
      ...['eq', 'gt', 'gte', 'lte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [target, greater],
        match: true,
      })),
      ...['lt'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [target, greater],
        match: false,
      })),
      ...['gt', 'lt', 'gte', 'lte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, greater],
        match: true,
      })),
      ...['eq'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, greater],
        match: false,
      })),
      ...['eq', 'lte', 'lt', 'gte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, target],
        match: true,
      })),
      ...['gt'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, target],
        match: false,
      })),
      ...['lt', 'lte'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less],
        match: true,
      })),
      ...['eq', 'gte', 'gt'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less],
        match: false,
      })),
      ...['gt', 'lt', 'gte', 'lte', 'eq'].map(it => ({
        semantic: 'some' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, target, greater],
        match: true,
      })),

      // every
      ...['eq', 'gt', 'lt', 'gte', 'lte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [],
        // vacuous truth applies, see https://en.wikipedia.org/wiki/Vacuous_truth
        // There is *no* value that does *not* match Alice => every value matches
        // this is in line with the default of [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
        // Also in RDF, if a property is present, it must have a value, so this is a hypothetical case
        match: true,
      })),
      ...['gt', 'gte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [greater],
        match: true,
      })),
      ...['eq', 'lt', 'lte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [greater],
        match: false,
      })),
      ...['gte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [target, greater],
        match: true,
      })),
      ...['eq', 'lte', 'lt', 'gt'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [target, greater],
        match: false,
      })),
      ...['eq', 'gt', 'lt', 'gte', 'lte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, greater],
        match: false,
      })),
      ...['lte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, target],
        match: true,
      })),
      ...['eq', 'lt', 'gt', 'gte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, target],
        match: false,
      })),
      ...['lt', 'lte'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less],
        match: true,
      })),
      ...['eq', 'gte', 'gt'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less],
        match: false,
      })),
      ...['gt', 'lt', 'gte', 'lte', 'eq'].map(it => ({
        semantic: 'every' as Semantic,
        operator: it as Operator,
        comparedAgainst: [less, target, greater],
        match: false,
      })),
    ])(
      `$semantic value $operator: it is $match, that $semantic of $comparedAgainst are $operator compared to ${target}`,
      ({ semantic, operator, comparedAgainst, match }) => {
        const result = doValuesMatch(comparedAgainst, {
          semantic,
          operator,
          target,
        });
        expect(result).toBe(match);
      },
    );
  });
});
