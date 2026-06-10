import { describe, it, expect } from "vitest";
import { sym } from "rdflib";
import { isRdfType } from "./isRdfType";

describe("isRdfType", () => {
  it("returns true for rdf:type predicate", () => {
    expect(
      isRdfType(sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type")),
    ).toBe(true);
  });

  it("returns false for any other predicate", () => {
    expect(isRdfType(sym("https://other.test/"))).toBe(false);
  });
});
