import { Statement, sym } from "rdflib";
import { accumulateValues } from "./accumulateValues";

describe("accumulate values", () => {
  it("single value for single predicate", () => {
    const s: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate.test"),
      sym("https://value.test"),
      sym("https://graph.test"),
    );
    const result = [s].reduce(accumulateValues, {});
    expect(result).toEqual({
      "https://predicate.test": ["https://value.test"],
    });
  });

  it("several predicates", () => {
    const firstStatement: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate1.test"),
      sym("https://value1.test"),
      sym("https://graph.test"),
    );
    const secondStatement: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate2.test"),
      sym("https://value2.test"),
      sym("https://graph.test"),
    );
    const result = [firstStatement, secondStatement].reduce(
      accumulateValues,
      {},
    );
    expect(result).toEqual({
      "https://predicate1.test": ["https://value1.test"],
      "https://predicate2.test": ["https://value2.test"],
    });
  });

  it("several values for a single predicate", () => {
    const firstStatement: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate.test"),
      sym("https://value1.test"),
      sym("https://graph.test"),
    );
    const secondStatement: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate.test"),
      sym("https://value2.test"),
      sym("https://graph.test"),
    );
    const result = [firstStatement, secondStatement].reduce(
      accumulateValues,
      {},
    );
    expect(result).toEqual({
      "https://predicate.test": ["https://value1.test", "https://value2.test"],
    });
  });

  it("only includes a value once for a given predicate", () => {
    const firstStatement: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate.test"),
      sym("https://value1.test"),
      sym("https://graph.test/1"),
    );
    const secondStatement: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate.test"),
      sym("https://value1.test"),
      sym("https://graph.test/2"),
    );
    const result = [firstStatement, secondStatement].reduce(
      accumulateValues,
      {},
    );
    expect(result).toEqual({
      "https://predicate.test": ["https://value1.test"],
    });
  });
});
