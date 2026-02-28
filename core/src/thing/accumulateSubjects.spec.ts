import { Statement, sym } from "rdflib";
import { accumulateSubjects } from "./accumulateSubjects";

describe("accumulate subjects", () => {
  it("single value for single predicate", () => {
    const s: Statement = new Statement(
      sym("https://subject.test"),
      sym("https://predicate.test"),
      sym("https://object.test"),
      sym("https://graph.test"),
    );
    const result = [s].reduce(accumulateSubjects, {});
    expect(result).toEqual({
      "https://predicate.test": ["https://subject.test"],
    });
  });

  it("several predicates", () => {
    const firstStatement: Statement = new Statement(
      sym("https://subject1.test"),
      sym("https://predicate1.test"),
      sym("https://object.test"),
      sym("https://graph.test"),
    );
    const secondStatement: Statement = new Statement(
      sym("https://subject2.test"),
      sym("https://predicate2.test"),
      sym("https://object.test"),
      sym("https://graph.test"),
    );
    const result = [firstStatement, secondStatement].reduce(
      accumulateSubjects,
      {},
    );
    expect(result).toEqual({
      "https://predicate1.test": ["https://subject1.test"],
      "https://predicate2.test": ["https://subject2.test"],
    });
  });

  it("several subjects for a single predicate", () => {
    const firstStatement: Statement = new Statement(
      sym("https://subject1.test"),
      sym("https://predicate.test"),
      sym("https://object.test"),
      sym("https://graph.test"),
    );
    const secondStatement: Statement = new Statement(
      sym("https://subject2.test"),
      sym("https://predicate.test"),
      sym("https://object.test"),
      sym("https://graph.test"),
    );
    const result = [firstStatement, secondStatement].reduce(
      accumulateSubjects,
      {},
    );
    expect(result).toEqual({
      "https://predicate.test": [
        "https://subject1.test",
        "https://subject2.test",
      ],
    });
  });

  it("only contains a subject once", () => {
    const firstStatement: Statement = new Statement(
      sym("https://subject1.test"),
      sym("https://predicate.test"),
      sym("https://object.test"),
      sym("https://graph.test/1"),
    );
    const secondStatement: Statement = new Statement(
      sym("https://subject1.test"),
      sym("https://predicate.test"),
      sym("https://object.test"),
      sym("https://graph.test/2"),
    );
    const result = [firstStatement, secondStatement].reduce(
      accumulateSubjects,
      {},
    );
    expect(result).toEqual({
      "https://predicate.test": ["https://subject1.test"],
    });
  });
});
