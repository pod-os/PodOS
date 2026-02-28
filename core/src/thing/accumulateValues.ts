import { Statement } from "rdflib";

interface Accumulator {
  [key: string]: string[];
}

/**
 * accumulate all object values of a resource grouped by predicate
 * @param accumulator - Target object to accumulate the values to
 * @param current - A statement with data to add to the object
 */
export const accumulateValues = (
  accumulator: Accumulator,
  current: Statement,
) => {
  const existing = accumulator[current.predicate.uri];
  if (existing && existing.includes(current.object.value)) return accumulator;
  return {
    ...accumulator,
    [current.predicate.uri]: existing
      ? [...existing, current.object.value]
      : [current.object.value],
  };
};
