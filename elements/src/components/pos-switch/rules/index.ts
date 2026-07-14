import { Literal, RdfType, Relation } from '@pod-os/core';

export { findMatchingRules } from './findMatchingRules';

export interface SwitchCaseRule {
  type: string;
  value?: string;
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
