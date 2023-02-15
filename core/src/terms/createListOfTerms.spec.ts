import { createListOfTerms } from "./createListOfTerms";

describe("create list of terms", () => {
  it("should create a list with single term of single prefix", () => {
    const result = createListOfTerms({
      schema: {
        name: "http://schema.org/name",
      },
    });
    expect(result).toEqual([
      {
        uri: "http://schema.org/name",
        shorthand: "schema:name",
      },
    ]);
  });

  it("should create a list with terms form all vocabs", () => {
    const result = createListOfTerms({
      schema: {
        name: "http://schema.org/name",
      },
      foaf: {
        name: "http://xmlns.com/foaf/0.1/name",
      },
    });
    expect(result).toEqual([
      {
        uri: "http://schema.org/name",
        shorthand: "schema:name",
      },
      {
        uri: "http://xmlns.com/foaf/0.1/name",
        shorthand: "foaf:name",
      },
    ]);
  });

  it("should create a list with multiple terms of single prefix", () => {
    const result = createListOfTerms({
      schema: {
        name: "http://schema.org/name",
        image: "http://schema.org/image",
      },
    });
    expect(result).toEqual([
      {
        uri: "http://schema.org/name",
        shorthand: "schema:name",
      },
      {
        uri: "http://schema.org/image",
        shorthand: "schema:image",
      },
    ]);
  });
});
