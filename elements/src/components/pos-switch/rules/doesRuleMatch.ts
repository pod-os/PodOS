import { IfPropertyRule, IfRevRule, IfTypeofRule, RuleContext, SwitchCaseRule } from './index';

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
  const hasLiteral = context.literals.map(x => x.predicate).includes(rule.value);
  const hasRelation = context.relations.map(x => x.predicate).includes(rule.value);
  return hasLiteral || hasRelation;
}

function doesReverseRelationMatch(rule: IfRevRule, context: RuleContext) {
  return context.reverseRelations.map(x => x.predicate).includes(rule.value);
}
