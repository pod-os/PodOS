import { Operator, Semantic } from './index';

export function testIfValuesMatchTarget(
  values: string[],
  semantics: Semantic,
  operator: Operator,
  target: string,
): boolean {
  const matches = values.map(val => {
    let cmp;
    const numVal = Number(val);
    const numTarget = Number(target);
    if (!Number.isNaN(numVal) && !Number.isNaN(numTarget)) {
      cmp = numVal - numTarget;
    } else {
      cmp = String(val).localeCompare(String(target));
    }
    switch (operator) {
      case 'eq':
        return cmp === 0;
      case 'gt':
        return cmp > 0;
      case 'gte':
        return cmp >= 0;
      case 'lt':
        return cmp < 0;
      case 'lte':
        return cmp <= 0;
    }
  });
  if (semantics == 'some') {
    return matches.some(Boolean);
  } else if (semantics == 'every') {
    return matches.every(Boolean);
  } else {
    throw new Error(`Unknown semantic: ${semantics}`);
  }
}
