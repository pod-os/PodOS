import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("any value", () => {
    let internalStore: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let store: Store;

    beforeEach(() => {
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
    });

    it("is undefined if nothing is found in store", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.anyValue("https://vocab.test/predicate")).toBeUndefined();
    });

    it("is the only value for the predicate", () => {
      const predicate = "https://vocab.test/predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.anyValue(predicate)).toBe("literal value");
    });

    it("is the first value to be found for the predicate", () => {
      const predicate = "https://vocab.test/predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "first value");
      internalStore.add(sym(uri), sym(predicate), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.anyValue(predicate)).toBe("first value");
    });

    it("is the value of the first predicate found", () => {
      const firstPredicate = "https://vocab.test/first-predicate";
      const secondPredicate = "https://vocab.test/second-predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(firstPredicate), "first value");
      internalStore.add(sym(uri), sym(secondPredicate), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.anyValue(firstPredicate, secondPredicate)).toBe("first value");
    });

    it("is the first undefined value found for any predicate", () => {
      const firstPredicate = "https://vocab.test/first-predicate";
      const secondPredicate = "https://vocab.test/second-predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(secondPredicate), "second value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.anyValue(firstPredicate, secondPredicate)).toBe("second value");
    });

    it("is undefined when called with no predicates", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym("https://vocab.test/predicate"), "value");
      const it = new Thing(uri, store);

      const result = it.anyValue();

      expect(result).toBeUndefined();
    });

    it("returns first value when predicates contain duplicates", () => {
      const predicate = "https://vocab.test/predicate";
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "test value");
      const it = new Thing(uri, store);

      const result = it.anyValue(predicate, predicate, predicate);

      expect(result).toBe("test value");
    });
  });
});
