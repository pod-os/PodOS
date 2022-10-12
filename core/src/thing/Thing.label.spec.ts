import { graph, sym } from "rdflib";
import { Thing } from "./Thing";

describe("Thing", function () {
  describe("label", () => {
    it("if the URI if nothing is found in store", () => {
      const store = graph();
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store
      );
      expect(it.label()).toBe(
        "https://jane.doe.example/container/file.ttl#fragment"
      );
    });

    it.each([
      "http://xmlns.com/foaf/0.1/nick",
      "http://purl.org/dc/terms/title",
      "http://purl.org/dc/elements/1.1/title",
      "http://xmlns.com/foaf/0.1/name",
      "http://schema.org/name",
      "https://schema.org/name",
      "http://www.w3.org/2000/01/rdf-schema#label",
      "https://www.w3.org/ns/activitystreams#name",
      "http://www.w3.org/2006/vcard/ns#fn",
      "http://schema.org/caption",
      "https://schema.org/caption",
    ])("returns the literal value of predicate %s", (predicate: string) => {
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store
      );
      const result = it.label();
      expect(result).toEqual("literal value");
    });
  });
});
