import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  let store: IndexedFormula;
  const mockSession = {} as unknown as PodOsSession;
  let reactiveStore: Store;

  beforeEach(() => {
    store = graph();
    reactiveStore = new Store(mockSession, undefined, undefined, store);
  });

  describe("description", () => {
    it("is the undefined if nothing is found in store", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
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
      store.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.description();
      expect(result).toEqual("literal value");
    });
  });
});
