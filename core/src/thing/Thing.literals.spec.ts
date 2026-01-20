import { blankNode, graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("literals", () => {
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
      expect(it.literals()).toEqual([]);
    });

    it("contains a single literal from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym("http://vocab.test/predicate"), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.literals();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          label: "predicate",
          values: ["literal value"],
        },
      ]);
    });

    it("contains multiple literals from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym("http://vocab.test/first"), "first value");
      store.add(sym(uri), sym("http://vocab.test/second"), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.literals();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          label: "first",
          values: ["first value"],
        },
        {
          predicate: "http://vocab.test/second",
          label: "second",
          values: ["second value"],
        },
      ]);
    });

    it("contains multiple values for a literal", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym("http://vocab.test/predicate"), "first value");
      store.add(sym(uri), sym("http://vocab.test/predicate"), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.literals();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          label: "predicate",
          values: ["first value", "second value"],
        },
      ]);
    });

    it("contains multiple literals and values", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym("http://vocab.test/first"), "value 1-1");
      store.add(sym(uri), sym("http://vocab.test/second"), "value 2-1");
      store.add(sym(uri), sym("http://vocab.test/second"), "value 2-2");
      store.add(sym(uri), sym("http://vocab.test/third"), "value 3-1");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.literals();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          label: "first",
          values: ["value 1-1"],
        },
        {
          predicate: "http://vocab.test/second",
          label: "second",
          values: ["value 2-1", "value 2-2"],
        },
        {
          predicate: "http://vocab.test/third",
          label: "third",
          values: ["value 3-1"],
        },
      ]);
    });

    it("ignores non literals", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym("http://vocab.test/literal"), "literal value");
      store.add(
        sym(uri),
        sym("http://vocab.test/url"),
        sym("https://url.test/"),
      );
      store.add(sym(uri), sym("http://vocab.test/blank"), blankNode("blank"));
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      const result = it.literals();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/literal",
          label: "literal",
          values: ["literal value"],
        },
      ]);
    });
  });
});
