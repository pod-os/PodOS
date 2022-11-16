import { sym } from "rdflib";
import { isRdfType } from "./isRdfType";

describe("isRdfType", () => {
  it("returns true for rdf:type predicate", () => {
    isRdfType(sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"));
  });

  it("returns false for any other predicate", () => {
    isRdfType(sym("https://other.test/"));
  });
});
