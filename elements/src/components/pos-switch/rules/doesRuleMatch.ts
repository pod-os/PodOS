import { IfPropertyRule, IfRevRule, IfTypeofRule, RuleContext, SwitchCaseRule } from './index';
import { testIfValuesMatchTarget } from '../logic';

export function doesRuleMatch(rule: SwitchCaseRule, context: RuleContext) {
  const ruleResult = evaluateRule(rule, context);
  return rule.not ? !ruleResult : ruleResult;
}

function evaluateRule(rule: SwitchCaseRule, context: RuleContext) {
  switch (rule.type) {
    case 'if-typeof':
      return doesTypeMatch(rule, context);
    case 'if-property':
      return doesPropertyMatch(rule, context);
    case 'if-rev':
      return doesReverseRelationMatch(rule, context);
    case 'else':
      return true;
    default:
      return false;
  }
}

function doesTypeMatch(rule: IfTypeofRule, context: RuleContext) {
  return context.types.map(x => x.uri).includes(rule.value);
}

function doesPropertyMatch(rule: IfPropertyRule, context: RuleContext) {
  const matchingLiteral = context.literals.find(it => it.predicate == rule.value);
  const matchingRelation = context.relations.find(it => it.predicate == rule.value);
  if (rule.comparison) {
    return testIfValuesMatchTarget(
      [...(matchingLiteral?.values ?? []), ...(matchingRelation?.uris ?? [])],
      rule.comparison.semantic,
      rule.comparison.operator,
      rule.comparison.target,
    );
  }
  return matchingLiteral !== undefined || matchingRelation !== undefined;
}

function doesReverseRelationMatch(rule: IfRevRule, context: RuleContext) {
  const matchingRev = context.reverseRelations.find(x => x.predicate == rule.value);
  if (rule.comparison && matchingRev) {
    return testIfValuesMatchTarget(
      matchingRev.uris,
      rule.comparison.semantic,
      rule.comparison.operator,
      rule.comparison.target,
    );
  }
  return matchingRev !== undefined;
}
