import { Literal, RdfType, Relation } from '@pod-os/core';

export interface SwitchCaseRule {
  type: string;
  value: string;
}

export const NO_RULE = {
  type: 'never',
};

export interface RuleContext {
  types: RdfType[];
  literals: Literal[];
  relations: Relation[];
  reverseRelations: Relation[];
}

export function testRule(rule: SwitchCaseRule, context: RuleContext) {
  if (rule.type == 'if-typeof') {
    return context.types.map(x => x.uri).includes(rule.value);
  }
  return false;
}
