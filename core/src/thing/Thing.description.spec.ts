import { graph, sym } from "rdflib";
import { Thing } from "./Thing";

describe("Thing", function () {
  describe("description", () => {
    it("is the undefined if nothing is found in store", () => {
      const store = graph();
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.description()).toBeUndefined();
    });

    it.each([
      "http://purl.org/dc/terms/description",
      "http://purl.org/dc/elements/1.1/description",
      "http://schema.org/description",
      "https://schema.org/description",
      "https://schema.org/text",
      "http://www.w3.org/2000/01/rdf-schema#comment",
      "https://www.w3.org/ns/activitystreams#summary",
      "https://www.w3.org/ns/activitystreams#content",
      "http://www.w3.org/2006/vcard/ns#note",
    ])("returns the literal value of predicate %s", (predicate: string) => {
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.description();
      expect(result).toEqual("literal value");
    });
  });
});
