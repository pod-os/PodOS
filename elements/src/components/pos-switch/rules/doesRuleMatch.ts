import { SwitchCaseRule } from './';
import { RuleContext } from './index';

export function doesRuleMatch(rule: SwitchCaseRule, context: RuleContext) {
  if (rule.type == 'if-typeof') {
    return context.types.map(x => x.uri).includes(rule.value ?? '');
  }
  return false;
}
