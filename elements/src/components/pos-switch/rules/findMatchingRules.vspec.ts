import { describe, expect, it } from '@stencil/vitest';
import { findMatchingRules } from './findMatchingRules';
import { ELSE_RULE, IfTypeofRule, SwitchCaseRule } from './index';
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

    it('ignores a matching if-else branch, if first rule already matched', () => {
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

    it('ignores a matching else branch, if first rule already matched', () => {
      const ifTypeA: IfTypeofRule = {
        type: 'if-typeof',
        value: 'https://vocab.example/A',
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('https://vocab.example/A')],
      };
      const rules: TestRules[] = [{ rule: ifTypeA }, { rule: ELSE_RULE }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: ifTypeA }]);
    });

    it('falls back to a matching if-else branch, if first rule did not match', () => {
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

    it('matches both, the first (independent) if rule and the else of the following if', () => {
      /*
        GIVEN
          if-typeof Person
          if-property name
            else if-property label // the else belongs to the preceding if, not to the first if
       */
      const ifPerson: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'http://schema.org/Person',
      };
      const ifHasName: SwitchCaseRule = {
        type: 'if-property',
        value: 'http://schema.org/name',
      };
      const elseIfHasLabel: SwitchCaseRule = {
        type: 'if-property',
        value: 'http://www.w3.org/2000/01/rdf-schema#label',
        else: true,
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('http://schema.org/Person')],
        literals: [literal('http://www.w3.org/2000/01/rdf-schema#label')],
      };
      const rules: TestRules[] = [{ rule: ifPerson }, { rule: ifHasName }, { rule: elseIfHasLabel }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: ifPerson }, { rule: elseIfHasLabel }]);
    });

    describe('if -> else if -> else', () => {
      /*
        GIVEN
          if-property name
            else if-property label
            else
       */
      const ifHasName: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://schema.org/name',
        },
      };
      const elseIfHasLabel: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://www.w3.org/2000/01/rdf-schema#label',
          else: true,
        },
      };
      const _else = { rule: ELSE_RULE };
      const rules: TestRules[] = [ifHasName, elseIfHasLabel, _else];

      it('if name is present, first rule matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName]);
      });

      it('if no name, but label is present, second rule matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://www.w3.org/2000/01/rdf-schema#label')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([elseIfHasLabel]);
      });
      it('if neither name nor label are present, else rule matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([_else]);
      });
      it('if name and label are present, first rule matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name'), literal('http://www.w3.org/2000/01/rdf-schema#label')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName]);
      });
    });

    describe('if -> else, if -> else', () => {
      /*
        GIVEN
          if-property name
            else
          if-property image
            else
       */
      const ifHasName: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://schema.org/name',
        },
      };
      const else_name = {
        rule: ELSE_RULE,
        id: 1, // id is just a discriminator for the test, a real else cae would contain the element to render
      };
      const ifHasImage: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://schema.org/image',
        },
      };
      const else_image = { rule: ELSE_RULE, id: 2 };

      const rules: TestRules[] = [ifHasName, else_name, ifHasImage, else_image];
      it('if name is present, first if and last else match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, else_image]);
      });
      it('if name and image are present, both if rules match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name'), literal('http://schema.org/image')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, ifHasImage]);
      });
      it('if label and picture are present, both else rules match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://www.w3.org/2000/01/rdf-schema#label'), literal('http://schema.org/picture')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([else_name, else_image]);
      });
      it('if name and picture are present the first if and second else match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name'), literal('http://schema.org/picture')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, else_image]);
      });
      it('if label and image are present the first else and second if match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://www.w3.org/2000/01/rdf-schema#label'), literal('http://schema.org/image')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([else_name, ifHasImage]);
      });
      it('if all are present, all if rules but no else matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [
            literal('http://schema.org/name'),
            literal('http://schema.org/image'),
            literal('http://www.w3.org/2000/01/rdf-schema#label'),
            literal('http://schema.org/picture'),
          ],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, ifHasImage]);
      });
    });

    describe('if -> else if, if -> else if', () => {
      /*
        GIVEN
          if-property name
            else if-property label
          if-property image
            else if-property picture
       */
      const ifHasName: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://schema.org/name',
        },
      };
      const elseIfHasLabel: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://www.w3.org/2000/01/rdf-schema#label',
          else: true,
        },
      };
      const ifHasImage: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://schema.org/image',
        },
      };
      const elseIfHasPicture: TestRules = {
        rule: {
          type: 'if-property',
          value: 'http://schema.org/picture',
          else: true,
        },
      };
      const rules: TestRules[] = [ifHasName, elseIfHasLabel, ifHasImage, elseIfHasPicture];
      it('if name is present, first rule matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName]);
      });
      it('if name and image are present, both if rules match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name'), literal('http://schema.org/image')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, ifHasImage]);
      });
      it('if label and picture are present, both else-if rules match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://www.w3.org/2000/01/rdf-schema#label'), literal('http://schema.org/picture')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([elseIfHasLabel, elseIfHasPicture]);
      });
      it('if name and picture are present the first if and second else match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://schema.org/name'), literal('http://schema.org/picture')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, elseIfHasPicture]);
      });
      it('if label and image are present the first elseif and second else match', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [literal('http://www.w3.org/2000/01/rdf-schema#label'), literal('http://schema.org/image')],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([elseIfHasLabel, ifHasImage]);
      });
      it('if all are present, all if rules but no else matches', () => {
        const context = {
          ...EMPTY_CONTEXT,
          literals: [
            literal('http://schema.org/name'),
            literal('http://schema.org/image'),
            literal('http://www.w3.org/2000/01/rdf-schema#label'),
            literal('http://schema.org/picture'),
          ],
        };
        const result = findMatchingRules(rules, context);
        expect(result).toEqual([ifHasName, ifHasImage]);
      });
    });

    it('falls back to plain else branch, if first rule did not match', () => {
      const ifTypeA: SwitchCaseRule = {
        type: 'if-typeof',
        value: 'https://vocab.example/A',
      };
      const context = {
        ...EMPTY_CONTEXT,
        types: [type('https://vocab.example/B')],
      };
      const rules: TestRules[] = [{ rule: ifTypeA }, { rule: ELSE_RULE }];
      const result = findMatchingRules(rules, context);
      expect(result).toEqual([{ rule: ELSE_RULE }]);
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
