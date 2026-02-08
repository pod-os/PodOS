import { blankNode, graph, sym, IndexedFormula } from "rdflib";
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

  describe("relations", () => {
    it("are empty, if store is empty", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.relations()).toEqual([]);
    });

    it("contains a single relation from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/resource"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/first"),
        sym("https://pod.example/first"),
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/second"),
        sym("https://pod.example/second"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/first"),
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/second"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/first"),
        sym("https://pod.example/first/1"),
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/second"),
        sym("https://pod.example/second/1"),
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/second"),
        sym("https://pod.example/second/2"),
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/third"),
        sym("https://pod.example/third/1"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/predicate"),
        sym("https://pod.example/resource"),
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/literal"),
        "literal value",
      );
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/blank"),
        blankNode("blank"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym(uri),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example/TypeA"),
      );
      internalStore.add(
        sym(uri),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example/TypeB"),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.relations();
      expect(result).toEqual([]);
    });
  });

  it("only follows the given predicate if provided", () => {
    const uri = "https://jane.doe.example/container/file.ttl#fragment";
    internalStore.add(
      sym(uri),
      sym("http://vocab.test/first"),
      sym("https://pod.example/first"),
    );
    internalStore.add(
      sym(uri),
      sym("http://vocab.test/second"),
      sym("https://pod.example/second"),
    );
    const it = new Thing(
      "https://jane.doe.example/container/file.ttl#fragment",
      store,
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
