import { Literal, RdfType, Relation } from '@pod-os/core';

export { findMatchingRules } from './findMatchingRules';

/**
 * A rule that matches if the resource is of a specific type
 */
export interface IfTypeofRule {
  type: 'if-typeof';
  /**
   * The URI of the type to match against.
   */
  value: string;
  /**
   * Negate the rule (match if the resource is not of the specified type)
   */
  not?: boolean;
  /**
   * Only apply the rule if no predecessor matched
   */
  else?: boolean;
}

/**
 * A rule that matches if the resource has a specific property (literal or relation)
 */
export interface IfPropertyRule {
  type: 'if-property';
  /**
   * The value of the property to match against (either literal value or the URI of a relation)
   */
  value: string;
  /**
   * Negate the rule (match if the resource does not have the specified property)
   */
  not?: boolean;
  /**
   * Only apply the rule if no predecessor matched
   */
  else?: boolean;
  /**
   * If set, the rule only matches if the value of the property matches the specified comparison
   */
  comparison?: Comparison;
}

/**
 * A rule that matches if the resource has a specific reverse relation
 */
export interface IfRevRule {
  type: 'if-rev';
  /**
   * The URI of the reverse relation to match against.
   */
  value: string;
  /**
   * Negate the rule (match if the resource does not have the specified reverse relation)
   */
  not?: boolean;
  /**
   * Only apply the rule if no predecessor matched
   */
  else?: boolean;
  /**
   * If set, the rule only matches if the URI of the reverse relation matches the specified comparison
   */
  comparison?: Comparison;
}

/**
 * A rule that only matches if all others did not
 */
export interface ElseRule {
  type: 'else';
  not: false;
  else: true;
}

/**
 * A rule that never matches
 */
export interface NeverRule {
  type: 'never';
  not: false;
  else: false;
}

/**
 * A rule defined by a pos-case
 */
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

/**
 * Contains the actual data a rule is matched against
 */
export interface RuleContext {
  types: RdfType[];
  literals: Literal[];
  relations: Relation[];
  reverseRelations: Relation[];
}

/**
 * Defines how to compare values to a specific target value
 */
export interface Comparison {
  /**
   * Does every value need to match, or only some?
   */
  semantic: Semantic;
  /**
   * The comparison operator to apply (e.g. value must be equal, greater than, etc.)
   */
  operator: Operator;
  /**
   * The target value to compare against.
   */
  target: string | number;
}

export type equals = 'eq';
export type greaterThan = 'gt';
export type greaterThanOrEqual = 'gte';
export type lessThan = 'lt';
export type lessThanOrEqual = 'lte';
export type some = 'some';
export type every = 'every';
export type Operator = equals | greaterThan | greaterThanOrEqual | lessThan | lessThanOrEqual;
export type Semantic = some | every;
