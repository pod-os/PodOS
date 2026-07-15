import { describe, expect, it } from '@stencil/vitest';
import { doValuesMatch } from './doValuesMatch';

describe('do values match', () => {
  describe('some eq', () => {
    it('no match, if none are given', () => {
      const result = doValuesMatch([], {
        semantic: 'some',
        operator: 'eq',
        target: 'Alice',
      });
      expect(result).toBe(false);
    });
    it('match if at least one is equal', () => {
      const result = doValuesMatch(['Alice', 'Bob'], {
        semantic: 'some',
        operator: 'eq',
        target: 'Alice',
      });
      expect(result).toBe(true);
    });
    it('no match if none is equal', () => {
      const result = doValuesMatch(['Alice', 'Bob'], {
        semantic: 'some',
        operator: 'eq',
        target: 'Claire',
      });
      expect(result).toBe(false);
    });
    it('match if all are equal', () => {
      const result = doValuesMatch(['Alice', 'Alice'], {
        semantic: 'some',
        operator: 'eq',
        target: 'Alice',
      });
      expect(result).toBe(true);
    });
  });

  describe('every eq', () => {
    it('match, if none are given (vacuous truth)', () => {
      const result = doValuesMatch([], {
        semantic: 'every',
        operator: 'eq',
        target: 'Alice',
      });
      // vacuous truth applies, see https://en.wikipedia.org/wiki/Vacuous_truth
      // There is *no* value that does *not* match Alice => every value matches
      // this is in line with the default of [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
      // Also in RDF, if a property is present, it must have a value, so this is a hypothetical case
      expect(result).toBe(true);
    });
    it('no match if only one is equal', () => {
      const result = doValuesMatch(['Alice', 'Bob'], {
        semantic: 'every',
        operator: 'eq',
        target: 'Alice',
      });
      expect(result).toBe(false);
    });
    it('no match if none is equal', () => {
      const result = doValuesMatch(['Alice', 'Bob'], {
        semantic: 'every',
        operator: 'eq',
        target: 'Claire',
      });
      expect(result).toBe(false);
    });
    it('match if all are equal', () => {
      const result = doValuesMatch(['Alice', 'Alice'], {
        semantic: 'every',
        operator: 'eq',
        target: 'Alice',
      });
      expect(result).toBe(true);
    });
  });
});
