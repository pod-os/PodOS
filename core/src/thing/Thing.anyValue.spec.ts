import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("any value", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("is undefined if nothing is found in store", () => {
      const store = graph();
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.anyValue("https://vocab.test/predicate")).toBeUndefined();
    });

    it("is the only value for the predicate", () => {
      const predicate = "https://vocab.test/predicate";
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.anyValue(predicate)).toBe("literal value");
    });

    it("is the first value to be found for the predicate", () => {
      const predicate = "https://vocab.test/predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(predicate), "first value");
      store.add(sym(uri), sym(predicate), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.anyValue(predicate)).toBe("first value");
    });

    it("is the value of the first predicate found", () => {
      const firstPredicate = "https://vocab.test/first-predicate";
      const secondPredicate = "https://vocab.test/second-predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(firstPredicate), "first value");
      store.add(sym(uri), sym(secondPredicate), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.anyValue(firstPredicate, secondPredicate)).toBe("first value");
    });

    it("is the first undefined value found for any predicate", () => {
      const firstPredicate = "https://vocab.test/first-predicate";
      const secondPredicate = "https://vocab.test/second-predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(secondPredicate), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );
      expect(it.anyValue(firstPredicate, secondPredicate)).toBe("second value");
    });

    it("is undefined when called with no predicates", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym("https://vocab.test/predicate"), "value");
      const it = new Thing(uri, store, reactiveStore);

      const result = it.anyValue();

      expect(result).toBeUndefined();
    });

    it("returns first value when predicates contain duplicates", () => {
      const predicate = "https://vocab.test/predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(sym(uri), sym(predicate), "test value");
      const it = new Thing(uri, store, reactiveStore);

      const result = it.anyValue(predicate, predicate, predicate);

      expect(result).toBe("test value");
    });
  });
});
