import { describe, expect, it } from '@stencil/vitest';
import { doesRuleMatch } from './doesRuleMatch';
import { RdfType } from '@pod-os/core';
import { SwitchCaseRule } from './index';

const EMPTY_CONTEXT = {
  types: [],
  literals: [],
  relations: [],
  reverseRelations: [],
};

describe('does rule match', () => {
  describe('if-typeof', () => {
    const ifTypeOfRecipe: SwitchCaseRule = {
      type: 'if-typeof',
      value: 'http://schema.org/Recipe',
    };

    it('does not match if no types are in context', () => {
      const result = doesRuleMatch(ifTypeOfRecipe, EMPTY_CONTEXT);
      expect(result).toBe(false);
    });
    it('matches if context contains the type in question', () => {
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Recipe')],
      };
      const result = doesRuleMatch(ifTypeOfRecipe, context);
      expect(result).toBe(true);
    });
    it('matches if context contains a matching type and also other types', () => {
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Recipe'), type('http://vocab.example.org/OtherType')],
      };
      const result = doesRuleMatch(ifTypeOfRecipe, context);
      expect(result).toBe(true);
    });

    describe('when negated', () => {
      const notIfTypeOfRecipe = {
        ...ifTypeOfRecipe,
        not: true,
      };

      it('does match if no types are in context', () => {
        const result = doesRuleMatch(notIfTypeOfRecipe, EMPTY_CONTEXT);
        expect(result).toBe(true);
      });
      it('does not match if context contains the type in question', () => {
        const context = {
          ...EMPTY_CONTEXT,
          types: [type('http://schema.org/Recipe')],
        };
        const result = doesRuleMatch(notIfTypeOfRecipe, context);
        expect(result).toBe(false);
      });
      it('does not matches if context contains a matching type and also other types', () => {
        const context = {
          ...EMPTY_CONTEXT,
          types: [type('http://schema.org/Recipe'), type('http://vocab.example.org/OtherType')],
        };
        const result = doesRuleMatch(notIfTypeOfRecipe, context);
        expect(result).toBe(false);
      });
    });
  });
});

function type(uri: string) {
  return {
    uri,
  } as RdfType;
}
