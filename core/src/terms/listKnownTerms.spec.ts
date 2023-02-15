import { listKnownTerms } from "./listKnownTerms";

describe("list known terms", () => {
  it("sample some important terms", () => {
    const predicates = listKnownTerms();
    expect(predicates).toContainEqual({
      uri: "http://schema.org/name",
      shorthand: "schema:name",
    });
    expect(predicates).toContainEqual({
      uri: "http://xmlns.com/foaf/0.1/img",
      shorthand: "foaf:img",
    });
    expect(predicates).toContainEqual({
      uri: "http://www.w3.org/2000/01/rdf-schema#label",
      shorthand: "rdfs:label",
    });
    expect(predicates).toContainEqual({
      uri: "http://www.w3.org/2006/vcard/ns#fn",
      shorthand: "vcard:fn",
    });
  });
});
