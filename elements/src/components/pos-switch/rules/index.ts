import { Literal, RdfType, Relation } from '@pod-os/core';

export { findMatchingRules } from './findMatchingRules';

export interface SwitchCaseRule {
  type: 'if-typeof' | 'if-property' | 'never';
  value?: string;
  not?: boolean;
}

export const NO_RULE: SwitchCaseRule = {
  type: 'never',
};

export interface RuleContext {
  types: RdfType[];
  literals: Literal[];
  relations: Relation[];
  reverseRelations: Relation[];
}
