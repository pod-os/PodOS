import { RuleContext, SwitchCaseRule } from './index';
import { doesRuleMatch } from './doesRuleMatch';

export function findMatchingRules<T extends { rule: SwitchCaseRule }>(cases: T[], context: RuleContext) {
  let previousRuleMatched = false;
  return cases.filter(it => {
    if (it.rule.else && previousRuleMatched) {
      return false; // else branches are ignored if we already found a match
    }
    const match = doesRuleMatch(it.rule, context);
    if (match) {
      previousRuleMatched = true;
    }
    return match;
  });
}
