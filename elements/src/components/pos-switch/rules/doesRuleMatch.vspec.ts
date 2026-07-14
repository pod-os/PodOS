import { describe, expect, it } from '@stencil/vitest';
import { doesRuleMatch } from './doesRuleMatch';
import { Literal, RdfType, Relation } from '@pod-os/core';
import { NEVER_RULE, SwitchCaseRule } from './index';

const EMPTY_CONTEXT = {
  types: [],
  literals: [],
  relations: [],
  reverseRelations: [],
};

describe('does rule match', () => {
  describe('never', () => {
    it('does never match', () => {
      const result = doesRuleMatch(NEVER_RULE, EMPTY_CONTEXT);
      expect(result).toBe(false);
    });
  });
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
  describe('if-property', () => {
    const ifPropertyName: SwitchCaseRule = {
      type: 'if-property',
      value: 'http://schema.org/name',
    };
    it('does not match if no properties are in context', () => {
      const result = doesRuleMatch(ifPropertyName, EMPTY_CONTEXT);
      expect(result).toBe(false);
    });
    it('matches if context contains a literal of that property', () => {
      const context = {
        ...EMPTY_CONTEXT,
        literals: [literal('http://schema.org/name')],
      };
      const result = doesRuleMatch(ifPropertyName, context);
      expect(result).toBe(true);
    });
    it('matches if context contains a relation of that property', () => {
      const context = {
        ...EMPTY_CONTEXT,
        relations: [relation('http://schema.org/name')],
      };
      const result = doesRuleMatch(ifPropertyName, context);
      expect(result).toBe(true);
    });
    it('matches if one match is present besides others', () => {
      const context = {
        ...EMPTY_CONTEXT,
        literals: [literal('http://vocab.example.org/other')],
        relations: [relation('http://schema.org/name'), relation('http://vocab.example.org/other-rel')],
      };
      const result = doesRuleMatch(ifPropertyName, context);
      expect(result).toBe(true);
    });

    describe('when negated', () => {
      const notIfPropertyName = {
        ...ifPropertyName,
        not: true,
      };
      it('matches if no properties are in context', () => {
        const result = doesRuleMatch(notIfPropertyName, EMPTY_CONTEXT);
        expect(result).toBe(true);
      });
      it('does not match if context contains a literal of that property', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name')],
        };
        const result = doesRuleMatch(notIfPropertyName, context);
        expect(result).toBe(false);
      });
      it('does not match if context contains a relation of that property', () => {
        const context = {
          ...EMPTY_CONTEXT,
          relations: [relation('http://schema.org/name')],
        };
        const result = doesRuleMatch(notIfPropertyName, context);
        expect(result).toBe(false);
      });
      it('does not match if one match is present besides others', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://vocab.example.org/other')],
          relations: [relation('http://schema.org/name'), relation('http://vocab.example.org/other-rel')],
        };
        const result = doesRuleMatch(notIfPropertyName, context);
        expect(result).toBe(false);
      });
    });
  });

  describe('if-rev', () => {
    const ifRevImage: SwitchCaseRule = {
      type: 'if-rev',
      value: 'http://schema.org/image',
    };
    it('does not match if no properties are in context', () => {
      const result = doesRuleMatch(ifRevImage, EMPTY_CONTEXT);
      expect(result).toBe(false);
    });

    it('matches if context contains a reverse relation of that property', () => {
      const context = {
        ...EMPTY_CONTEXT,
        reverseRelations: [relation('http://schema.org/image')],
      };
      const result = doesRuleMatch(ifRevImage, context);
      expect(result).toBe(true);
    });
    it('matches if one match is present besides others', () => {
      const context = {
        ...EMPTY_CONTEXT,
        reverseRelations: [relation('http://schema.org/image'), relation('http://vocab.example.org/other-rel')],
      };
      const result = doesRuleMatch(ifRevImage, context);
      expect(result).toBe(true);
    });

    describe('when negated', () => {
      const notIfRevImage = {
        ...ifRevImage,
        not: true,
      };
      it('matches if no properties are in context', () => {
        const result = doesRuleMatch(notIfRevImage, EMPTY_CONTEXT);
        expect(result).toBe(true);
      });
      it('does not match if context contains a reverse relation of that property', () => {
        const context = {
          ...EMPTY_CONTEXT,
          reverseRelations: [relation('http://schema.org/image')],
        };
        const result = doesRuleMatch(notIfRevImage, context);
        expect(result).toBe(false);
      });
      it('does not match if one match is present besides others', () => {
        const context = {
          ...EMPTY_CONTEXT,
          reverseRelations: [relation('http://schema.org/image'), relation('http://vocab.example.org/other-rel')],
        };
        const result = doesRuleMatch(notIfRevImage, context);
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
