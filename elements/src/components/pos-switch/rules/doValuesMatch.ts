import { Comparison } from './index';

/**
 * Checks whether the given values match the given target according to the given comparison
 * @param values
 * @param comparison
 */
export function doValuesMatch(values: string[], comparison: Comparison): boolean {
  const { operator, semantic, target } = comparison;
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
  if (semantic == 'some') {
    return matches.some(Boolean);
  } else if (semantic == 'every') {
    return matches.every(Boolean);
  } else {
    throw new Error(`Unknown semantic: ${semantic}`);
  }
}
