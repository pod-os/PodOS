import { SwitchCaseRule } from './';
import { RuleContext } from './index';

export function doesRuleMatch(rule: SwitchCaseRule, context: RuleContext) {
  const ruleResult = evaluateRule(rule, context);
  return rule.not ? !ruleResult : ruleResult;
}

function evaluateRule(rule: SwitchCaseRule, context: RuleContext) {
  if (rule.type == 'if-typeof') {
    return context.types.map(x => x.uri).includes(rule.value ?? '');
  }
  if (rule.type == 'if-property') {
    const hasLiteral = context.literals.map(x => x.predicate).includes(rule.value ?? '');
    const hasRelation = context.relations.map(x => x.predicate).includes(rule.value ?? '');
    return hasLiteral || hasRelation;
  }
  if (rule.type == 'if-rev') {
    return context.reverseRelations.map(x => x.predicate).includes(rule.value ?? '');
  }
  return false;
}
