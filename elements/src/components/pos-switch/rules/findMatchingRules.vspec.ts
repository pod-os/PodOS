import { describe, expect, it } from '@stencil/vitest';
import { findMatchingRules } from './findMatchingRules';
import { SwitchCaseRule } from './index';
import { Literal, RdfType, Relation } from '@pod-os/core';

const EMPTY_CONTEXT = {
  types: [],
  literals: [],
  relations: [],
  reverseRelations: [],
};

interface TestRules {
  rule: SwitchCaseRule;
}

describe('find matching rules', () => {
  it('finds nothing, if nothing is given', () => {
    const rules: TestRules[] = [];
    const result = findMatchingRules(rules, EMPTY_CONTEXT);
    expect(result).toEqual([]);
  });

  describe('with independent rules', () => {
    it('finds nothing if a single rule does not match', () => {
      const rule: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://vocab.example.org/OtherType')],
      };
      const rules: TestRules[] = [{ rule }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([]);
    });

    it('finds a single matching rule', () => {
      const rule: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Recipe')],
      };
      const rules: TestRules[] = [{ rule }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual(rules);
    });

    it('finds all rules if all match', () => {
      const ifTypeOfRecipe: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      };
      const ifPropertyName: SwitchCaseRule = {
        type: 'if-property',
        value: 'http://schema.org/name',
      };
      const ifReverseOfRecipeRelation: SwitchCaseRule = {
        type: 'if-rev',
        value: 'http://schema.org/recipe',
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Recipe')],
        literals: [literal('http://schema.org/name')],
        reverseRelations: [relation('http://schema.org/recipe')],
      };
      const rules: TestRules[] = [
        { rule: ifTypeOfRecipe },
        { rule: ifPropertyName },
        { rule: ifReverseOfRecipeRelation },
      ];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual(rules);
    });

    it('does not find the rules that do not match', () => {
      const ifTypeOfRecipe: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      };
      const ifPropertyName: SwitchCaseRule = {
        type: 'if-property',
        value: 'http://schema.org/name',
      };
      const ifReverseOfRecipeRelation: SwitchCaseRule = {
        type: 'if-rev',
        value: 'http://schema.org/recipe',
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Recipe')],
        literals: [literal('https://vocab.example.org/other-name')],
        reverseRelations: [relation('http://schema.org/recipe')],
      };
      const rules: TestRules[] = [
        { rule: ifTypeOfRecipe },
        { rule: ifPropertyName },
        { rule: ifReverseOfRecipeRelation },
      ];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: ifTypeOfRecipe }, { rule: ifReverseOfRecipeRelation }]);
    });
  });

  describe('with if-else rules', () => {
    it('matches the if branch only', () => {
      const ifRecipe: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Recipe',
      };
      const elseIfBook: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Book',
        else: true,
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Recipe')],
      };
      const rules: TestRules[] = [{ rule: ifRecipe }, { rule: elseIfBook }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: ifRecipe }]);
    });

    it('ignores a matching else branch, if first rule already matched', () => {
      const ifTypeA: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'https://vocab.example/A',
      };
      const elseIfTypeB: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'https://vocab.example/B',
        else: true,
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('https://vocab.example/A'), type('https://vocab.example/B')],
      };
      const rules: TestRules[] = [{ rule: ifTypeA }, { rule: elseIfTypeB }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: ifTypeA }]);
    });

    it('falls back to a matching else branch, if first rule did not match', () => {
      const ifTypeA: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'https://vocab.example/A',
      };
      const elseIfTypeB: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'https://vocab.example/B',
        else: true,
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('https://vocab.example/B')],
      };
      const rules: TestRules[] = [{ rule: ifTypeA }, { rule: elseIfTypeB }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: elseIfTypeB }]);
    });
  });
});

function type(uri: string) {
  return {
    uri,
  } as RdfType;
}

function literal(predicate: string) {
  return {
    predicate,
  } as Literal;
}

function relation(predicate: string) {
  return {
    predicate,
  } as Relation;
}
