import { RuleContext, SwitchCaseRule } from './index';
import { doesRuleMatch } from './doesRuleMatch';

export function findMatchingRules<T extends { rule: SwitchCaseRule }>(cases: T[], context: RuleContext) {
  /**
   * scope of if-else statements
   * each plain if (without else) increases the scope by 1
   * else branches are ignored if we already found a match in the current scope
   */
  let scope = 0;
  /**
   * scope of the previous rule that matched
   */
  let previousRuleMatched = -1;
  return cases.filter(it => {
    if (it.rule.else && previousRuleMatched == scope) {
      return false; // else branches are ignored if we already found a match in the current scope
    }
    if (!it.rule.else) {
      scope++; // plain if rule -> new scope
    }
    const match = doesRuleMatch(it.rule, context);
    if (match) {
      previousRuleMatched = scope; // found a match in the current if-else scope
    }
    return match;
  });
}
