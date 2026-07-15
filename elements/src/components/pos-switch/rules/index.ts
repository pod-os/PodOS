import { Literal, RdfType, Relation } from '@pod-os/core';
import { Semantic, Operator } from '../logic';

export { findMatchingRules } from './findMatchingRules';

export interface IfTypeofRule {
  type: 'if-typeof';
  value: string;
  not?: boolean;
  else?: boolean;
}

export interface IfPropertyRule {
  type: 'if-property';
  value: string;
  not?: boolean;
  else?: boolean;
  comparison?: {
    operator: Operator;
    sematic: Semantic;
    target: string;
  };
}

export interface IfRevRule {
  type: 'if-rev';
  value: string;
  not?: boolean;
  else?: boolean;
}

export interface ElseRule {
  type: 'else';
  not: false;
  else: true;
}

export interface NeverRule {
  type: 'never';
  not: false;
  else: false;
}

export type SwitchCaseRule = IfTypeofRule | IfPropertyRule | IfRevRule | ElseRule | NeverRule;

export const NEVER_RULE: NeverRule = {
  type: 'never',
  not: false,
  else: false,
};

export const ELSE_RULE: ElseRule = {
  type: 'else',
  not: false,
  else: true,
};

export interface RuleContext {
  types: RdfType[];
  literals: Literal[];
  relations: Relation[];
  reverseRelations: Relation[];
}
