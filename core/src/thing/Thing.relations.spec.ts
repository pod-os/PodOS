import { blankNode, graph, sym, IndexedFormula } from "rdflib";
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

  describe("relations", () => {
    it("are empty, if store is empty", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.relations()).toEqual([]);
    });

    it("contains a single relation from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/resource"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.relations();
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
        sym(uri),
        sym("http://vocab.test/first"),
        sym("https://pod.example/first"),
      );
      store.add(
        sym(uri),
        sym("http://vocab.test/second"),
        sym("https://pod.example/second"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.relations();
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
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/first"),
      );
      store.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/second"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.relations();
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
        sym(uri),
        sym("http://vocab.test/first"),
        sym("https://pod.example/first/1"),
      );
      store.add(
        sym(uri),
        sym("http://vocab.test/second"),
        sym("https://pod.example/second/1"),
      );
      store.add(
        sym(uri),
        sym("http://vocab.test/second"),
        sym("https://pod.example/second/2"),
      );
      store.add(
        sym(uri),
        sym("http://vocab.test/third"),
        sym("https://pod.example/third/1"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.relations();
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

    it("ignores non named nodes", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/resource"),
      );
      store.add(sym(uri), sym("http://vocab.test/literal"), "literal value");
      store.add(sym(uri), sym("http://vocab.test/blank"), blankNode("blank"));
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.relations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          label: "predicate",
          uris: ["https://pod.example/resource"],
        },
      ]);
    });

    it("does not contain rdf types", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym(uri),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example/TypeA"),
      );
      store.add(
        sym(uri),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example/TypeB"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.relations();
      expect(result).toEqual([]);
    });
  });

  it("only follows the given predicate if provided", () => {
    const uri = "https://jane.doe.example/container/file.ttl#fragment";
    store.add(
      sym(uri),
      sym("http://vocab.test/first"),
      sym("https://pod.example/first"),
    );
    store.add(
      sym(uri),
      sym("http://vocab.test/second"),
      sym("https://pod.example/second"),
    );
    const it = new Thing(
      "https://jane.doe.example/container/file.ttl#fragment",
      store,
      reactiveStore,
    );
    const result = it.relations("http://vocab.test/first");
    expect(result).toEqual([
      {
        predicate: "http://vocab.test/first",
        label: "first",
        uris: ["https://pod.example/first"],
      },
    ]);
  });
});
