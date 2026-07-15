import { describe, expect, it } from '@stencil/vitest';
import { doValuesMatch } from './doValuesMatch';

describe('do values match', () => {
  describe.each(['Alice', 100])('equals %s', (target: string | number) => {
    describe('some', () => {
      it(`no match for ${target}, if no values are given`, () => {
        const result = doValuesMatch([], {
          semantic: 'some',
          operator: 'eq',
          target,
        });
        expect(result).toBe(false);
      });
      it(`match if at least one is equal to ${target}`, () => {
        const result = doValuesMatch([target, 'Bob'], {
          semantic: 'some',
          operator: 'eq',
          target,
        });
        expect(result).toBe(true);
      });
      it(`no match if none is equal to ${target}`, () => {
        const result = doValuesMatch(['Bob', 'Claire'], {
          semantic: 'some',
          operator: 'eq',
          target,
        });
        expect(result).toBe(false);
      });
      it(`match if all are equal to ${target}`, () => {
        const result = doValuesMatch([target, target], {
          semantic: 'some',
          operator: 'eq',
          target,
        });
        expect(result).toBe(true);
      });
    });
    describe('every', () => {
      it('match, if no values are given (vacuous truth)', () => {
        const result = doValuesMatch([], {
          semantic: 'every',
          operator: 'eq',
          target,
        });
        // vacuous truth applies, see https://en.wikipedia.org/wiki/Vacuous_truth
        // There is *no* value that does *not* match Alice => every value matches
        // this is in line with the default of [Array.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
        // Also in RDF, if a property is present, it must have a value, so this is a hypothetical case
        expect(result).toBe(true);
      });
      it(`no match if only one is equal to ${target}`, () => {
        const result = doValuesMatch([target, 'Bob'], {
          semantic: 'every',
          operator: 'eq',
          target,
        });
        expect(result).toBe(false);
      });
      it(`no match if none is equal to ${target}`, () => {
        const result = doValuesMatch(['Bob', 'Claire'], {
          semantic: 'every',
          operator: 'eq',
          target: 'Claire',
        });
        expect(result).toBe(false);
      });
      it(`match if all are equal to ${target}`, () => {
        const result = doValuesMatch([target, target], {
          semantic: 'every',
          operator: 'eq',
          target,
        });
        expect(result).toBe(true);
      });
    });
  });

  describe.each([[['Alice', 'Bob', 'Claire']], [[99, 100, 101]]])('greater than (%s)', list => {
    const less = list[0];
    const target = list[1];
    const greater = list[2];
    describe('some', () => {
      it(`no match, if no values are given`, () => {
        const result = doValuesMatch([], {
          semantic: 'some',
          operator: 'gt',
          target,
        });
        expect(result).toBe(false);
      });
      it(`match if at least one (${greater}) is greater than ${target}`, () => {
        const result = doValuesMatch([less, greater], {
          semantic: 'some',
          operator: 'gt',
          target,
        });
        expect(result).toBe(true);
      });
      it(`no match if none is greater than ${target}`, () => {
        const result = doValuesMatch([less, target], {
          semantic: 'some',
          operator: 'gt',
          target: target,
        });
        expect(result).toBe(false);
      });
      it(`match if all are greater than ${target}`, () => {
        const result = doValuesMatch([greater], {
          semantic: 'some',
          operator: 'gt',
          target: target,
        });
        expect(result).toBe(true);
      });
    });
    describe('every', () => {
      it(`match, if no values are given (vacuous truth)`, () => {
        const result = doValuesMatch([], {
          semantic: 'every',
          operator: 'gt',
          target,
        });
        expect(result).toBe(true);
      });
      it(`no match if only one (${greater}, but not ${target}) is greater than ${target}`, () => {
        const result = doValuesMatch([target, greater], {
          semantic: 'every',
          operator: 'gt',
          target,
        });
        expect(result).toBe(false);
      });
      it(`no match if none is greater than ${target}`, () => {
        const result = doValuesMatch([less, target], {
          semantic: 'every',
          operator: 'gt',
          target: target,
        });
        expect(result).toBe(false);
      });
      it(`match if all are greater than ${target}`, () => {
        const result = doValuesMatch([greater], {
          semantic: 'every',
          operator: 'gt',
          target: target,
        });
        expect(result).toBe(true);
      });
    });
  });
});
