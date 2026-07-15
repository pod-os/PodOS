export const operators = ['eq', 'gt', 'gte', 'lt', 'lte'] as const;
export type Operator = (typeof operators)[number];

export const semantics = ['some', 'every'] as const;
export type Semantic = (typeof semantics)[number];

export interface Comparison {
  semantic: Semantic;
  operator: Operator;
  target: string;
}

export const operatorSemanticCombinations = semantics.flatMap(semantic =>
  operators.map(operator => ({ semantic, operator })),
);

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
