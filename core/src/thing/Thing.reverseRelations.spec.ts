import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("reverse relations", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("are empty, if store is empty", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.reverseRelations()).toEqual([]);
    });

    it("contains a single relation from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/resource"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          label: "predicate",
          uris: ["https://pod.example/resource"],
        },
      ]);
    });

    it("contains multiple relations from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          label: "first",
          uris: ["https://pod.example/first"],
        },
        {
          predicate: "http://vocab.test/second",
          label: "second",
          uris: ["https://pod.example/second"],
        },
      ]);
    });

    it("contains multiple uris for a relation", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          label: "predicate",
          uris: ["https://pod.example/first", "https://pod.example/second"],
        },
      ]);
    });

    it("contains multiple relations and uris", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first/1"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second/1"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second/2"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/third/1"),
        sym("http://vocab.test/third"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          label: "first",
          uris: ["https://pod.example/first/1"],
        },
        {
          predicate: "http://vocab.test/second",
          label: "second",
          uris: [
            "https://pod.example/second/1",
            "https://pod.example/second/2",
          ],
        },
        {
          predicate: "http://vocab.test/third",
          label: "third",
          uris: ["https://pod.example/third/1"],
        },
      ]);
    });

    it("only follows the given predicate if provided", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),

        sym(uri),
      );
      store.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      const it = new Thing(uri, store, reactiveStore);
      const result = it.reverseRelations("http://vocab.test/first");
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          label: "first",
          uris: ["https://pod.example/first"],
        },
      ]);
    });
  });
});
