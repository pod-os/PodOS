import { graph, IndexedFormula, literal, quad, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";
import { Subscription } from "rxjs";

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

  describe("observeAnyValue", () => {
    jest.useFakeTimers();

    let internalStore: IndexedFormula,
      subscriber: jest.Mock,
      uri: string,
      predicate: string,
      anyValueSpy: jest.SpyInstance,
      subscription: Subscription;

    beforeEach(() => {
      // Given a store with statements about a URI
      internalStore = graph();
      uri = "https://jane.doe.example/container/file.ttl#fragment";
      predicate = "https://vocab.test/predicate";
      internalStore.add(sym(uri), sym(predicate), "literal value");
      internalStore.add(
        sym(uri),
        sym("https://vocab.test/other-predicate"),
        "literal value",
      );

      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);

      // and a Thing with a anyValue method
      subscriber = jest.fn();
      const thing = new Thing(uri, store);
      anyValueSpy = jest.spyOn(thing, "anyValue");

      // and a subscription to changes in value
      const observable = thing.observeAnyValue(predicate);
      subscription = observable.subscribe(subscriber);
    });

    it("pushes existing value immediately", () => {
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([["literal value"]]);
    });

    it("pushes undefined if single existing value is removed", () => {
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([undefined]);
    });

    it("stops pushing after unsubscribe", () => {
      subscription.unsubscribe();
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
    });

    it("ignores irrelevant removal", () => {
      internalStore.removeStatement(
        quad(
          sym(uri),
          sym("https://vocab.test/other-predicate"),
          literal("literal value"),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("does not change if a value is already present", () => {
      internalStore.add(sym(uri), sym(predicate), "literal value 2");
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("pushes in groups", () => {
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      internalStore.add(sym(uri), sym(predicate), "new literal value");
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it("pushes a value if none was present, without calling anyValue again", () => {
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      internalStore.add(sym(uri), sym(predicate), "new literal value");
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.lastCall).toEqual(["new literal value"]);
    });

    it("pushes a different value when one is removed if multiple are present", () => {
      internalStore.add(sym(uri), sym(predicate), "literal value 2");
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual(["literal value 2"]);
    });

    it("does not change again until next removal", () => {
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      internalStore.add(
        quad(sym(uri), sym(predicate), literal("literal value 2")),
      );
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual(["literal value 2"]);

      internalStore.add(
        quad(sym(uri), sym(predicate), literal("literal value 3")),
      );
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledTimes(2);

      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value 2")),
      );
      jest.advanceTimersByTime(250);
      expect(anyValueSpy).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(3);
      expect(subscriber.mock.lastCall).toEqual(["literal value 3"]);
    });

    it("ignores irrelevant addition", () => {
      internalStore.removeStatement(
        quad(sym(uri), sym(predicate), literal("literal value")),
      );
      internalStore.add(
        sym(uri),
        sym("https://vocab.test/other-predicate"),
        literal("wrong literal value"),
      );
      internalStore.add(
        sym(uri),
        sym(predicate),
        literal("right literal value"),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber.mock.lastCall).toEqual(["right literal value"]);
    });
  });
});
