import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  let internalStore: IndexedFormula;
  const mockSession = {} as unknown as PodOsSession;
  let store: Store;

  beforeEach(() => {
    internalStore = graph();
    store = new Store(mockSession, undefined, undefined, internalStore);
  });

  describe("description", () => {
    it("is the undefined if nothing is found in store", () => {
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
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.description();
      expect(result).toEqual("literal value");
    });
  });
});
