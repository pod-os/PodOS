import { RuleContext, SwitchCaseRule } from './index';
import { doesRuleMatch } from './doesRuleMatch';

export function findMatchingRules<T extends { rule: SwitchCaseRule }>(cases: T[], context: RuleContext) {
  return cases.filter(it => doesRuleMatch(it.rule, context));
}
