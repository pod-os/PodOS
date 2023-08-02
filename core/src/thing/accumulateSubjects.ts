import { Statement } from "rdflib";

interface Accumulator {
  [key: string]: string[];
}

/**
 * accumulate all subject values referencing a resource grouped by predicate
 * @param accumulator - Target javascript object to accumulate the values to
 * @param current - A statement with data to add to the accumulator
 */
export const accumulateSubjects = (
  accumulator: Accumulator,
  current: Statement,
) => {
  const existing = accumulator[current.predicate.uri];
  return {
    ...accumulator,
    [current.predicate.uri]: existing
      ? [...existing, current.subject.value]
      : [current.subject.value],
  };
};
