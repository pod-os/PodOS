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

    describe("with pre-populated store", () => {
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
        const store = new Store(
          mockSession,
          undefined,
          undefined,
          internalStore,
        );

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

    describe("a store without any statements yet", () => {
      let internalStore: IndexedFormula,
        subscriber: jest.Mock,
        uri: string,
        predicate: string,
        anyValueSpy: jest.SpyInstance,
        subscription: Subscription,
        store: Store;

      beforeEach(() => {
        // Given a store without any statements yet
        internalStore = graph();
        uri = "https://jane.doe.example/container/file.ttl#fragment";
        predicate = "https://vocab.test/predicate";

        const mockSession = {} as unknown as PodOsSession;
        store = new Store(mockSession, undefined, undefined, internalStore);

        // and a Thing with a anyValue method
        subscriber = jest.fn();
        const thing = new Thing(uri, store);
        anyValueSpy = jest.spyOn(thing, "anyValue");

        // and a subscription to changes in value
        const observable = thing.observeAnyValue(predicate);
        subscription = observable.subscribe(subscriber);
      });

      afterEach(() => {
        subscription.unsubscribe();
      });

      it("pushes a value if none was present, without calling anyValue again", () => {
        // when the first value for that predicate occurs
        internalStore.add(sym(uri), sym(predicate), "new literal value");
        jest.advanceTimersByTime(250);

        // then the subscriber receives both the initial undefined and the new value
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.mock.calls).toEqual([
          [undefined],
          ["new literal value"],
        ]);

        // but anyValue was ony called once
        expect(anyValueSpy).toHaveBeenCalledTimes(1);
      });

      it("emits new value after add-remove-add cycle", () => {
        // Given a thing observing multiple predicates
        const uri = "https://jane.doe.example/container/file.ttl#fragment";
        const predicateA = "https://vocab.test/predicate-a";
        const predicateB = "https://vocab.test/predicate-b";

        const thing = new Thing(uri, store);
        const subscriber = jest.fn();
        const observable = thing.observeAnyValue(predicateA, predicateB);
        observable.subscribe(subscriber);

        // When: undefined → +a → -a → +b
        expect(subscriber).toHaveBeenCalledWith(undefined);

        const valueAQuad = quad(sym(uri), sym(predicateA), literal("value A"));
        internalStore.add(valueAQuad);
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledWith("value A");

        internalStore.removeStatement(valueAQuad);
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledWith(undefined);

        internalStore.add(sym(uri), sym(predicateB), "value B");
        jest.advanceTimersByTime(250);

        // Then: should emit "value B"
        expect(subscriber).toHaveBeenCalledWith("value B");
      });

      describe("Multiple Predicates", () => {
        it("picks first predicate when multiple have values in initial state", () => {
          // Given: a store with values for multiple predicates
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";
          const predicateC = "https://vocab.test/predicate-c";

          internalStore.add(sym(uri), sym(predicateA), "value-a");
          internalStore.add(sym(uri), sym(predicateB), "value-b");
          internalStore.add(sym(uri), sym(predicateC), "value-c");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();

          // When: subscribing to multiple predicates
          const observable = thing.observeAnyValue(
            predicateA,
            predicateB,
            predicateC,
          );
          observable.subscribe(subscriber);

          // Then: first emission should be the value of the first predicate
          expect(subscriber).toHaveBeenCalledTimes(1);
          expect(subscriber.mock.calls[0]).toEqual(["value-a"]);
        });

        it("falls back to second predicate when all values removed from first", () => {
          // Given: a store with multiple values on first predicate and one on second
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";
          const predicateC = "https://vocab.test/predicate-c";

          internalStore.add(sym(uri), sym(predicateA), "value-a1");
          internalStore.add(sym(uri), sym(predicateA), "value-a2");
          internalStore.add(sym(uri), sym(predicateB), "value-b");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();

          // And: subscribing to multiple predicates
          const observable = thing.observeAnyValue(
            predicateA,
            predicateB,
            predicateC,
          );
          observable.subscribe(subscriber);

          // And: initial value is from predicateA
          expect(subscriber.mock.calls[0]).toEqual(["value-a1"]);

          // When: both values from predicateA are removed
          internalStore.removeMatches(
            sym(uri),
            sym(predicateA),
            literal("value-a1"),
          );
          internalStore.removeMatches(
            sym(uri),
            sym(predicateA),
            literal("value-a2"),
          );
          jest.advanceTimersByTime(250);

          // Then: should fall back to predicateB
          expect(subscriber).toHaveBeenCalledWith("value-b");
        });

        it("keeps value from first predicate if second one gets a value after that", () => {
          // Given multiple predicates are observed
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(predicateA, predicateB);
          observable.subscribe(subscriber);

          // and predicateB has value
          internalStore.add(sym(uri), sym(predicateB), "value-b");
          jest.advanceTimersByTime(250);
          expect(subscriber.mock.calls).toEqual([[undefined], ["value-b"]]);

          // When predicateA gets a value while predicate B still has value
          internalStore.add(sym(uri), sym(predicateA), "value-a");
          jest.advanceTimersByTime(250);

          // Then no change occurs because we have one from predicateA
          expect(subscriber.mock.calls).toEqual([[undefined], ["value-b"]]);
        });
      });

      describe("Multiple Values Per Predicate", () => {
        it("emits last remaining value when all but one are removed", () => {
          // Given: a store with three values for the same predicate
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicate = "https://vocab.test/predicate";

          internalStore.add(sym(uri), sym(predicate), "value1");
          internalStore.add(sym(uri), sym(predicate), "value2");
          internalStore.add(sym(uri), sym(predicate), "value3");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(predicate);
          observable.subscribe(subscriber);

          expect(subscriber.mock.calls[0]).toEqual(["value1"]);

          // When: value1 and value2 are removed
          internalStore.removeMatches(
            sym(uri),
            sym(predicate),
            literal("value1"),
          );
          internalStore.removeMatches(
            sym(uri),
            sym(predicate),
            literal("value2"),
          );
          jest.advanceTimersByTime(250);

          // Then: should emit value3 (the last remaining)
          expect(subscriber).toHaveBeenCalledWith("value3");
          expect(subscriber.mock.lastCall).toEqual(["value3"]);
        });

        it("emits next value when first value removed if multiple exist", () => {
          // Given: a store with multiple values for the same predicate
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicate = "https://vocab.test/predicate";

          internalStore.add(sym(uri), sym(predicate), "value1");
          internalStore.add(sym(uri), sym(predicate), "value2");
          internalStore.add(sym(uri), sym(predicate), "value3");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();

          // And: thing subscribing to the predicate
          const observable = thing.observeAnyValue(predicate);
          observable.subscribe(subscriber);

          // And: initial value is the first one
          expect(subscriber.mock.calls[0]).toEqual(["value1"]);

          // When: the first value is removed
          internalStore.removeMatches(
            sym(uri),
            sym(predicate),
            literal("value1"),
          );
          jest.advanceTimersByTime(250);

          // Then: should emit the next value
          expect(subscriber).toHaveBeenCalledWith("value2");
        });
      });

      describe("Additional Predicate Switching", () => {
        it("switches between predicates back and forth", () => {
          // Given: two predicates are observed
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(predicateA, predicateB);
          observable.subscribe(subscriber);

          // And both have no value
          expect(subscriber).toHaveBeenCalledWith(undefined);

          // When: +predicateA=value-a → emit value-a
          internalStore.add(sym(uri), sym(predicateA), "value-a");
          jest.advanceTimersByTime(250);
          expect(subscriber).toHaveBeenCalledWith("value-a");

          // When: -predicateA=value-a → emit undefined
          internalStore.removeMatches(
            sym(uri),
            sym(predicateA),
            literal("value-a"),
          );
          jest.advanceTimersByTime(250);
          expect(subscriber).toHaveBeenCalledWith(undefined);

          // When: +predicateB=value-b → emit value-b
          internalStore.add(sym(uri), sym(predicateB), "value-b");
          jest.advanceTimersByTime(250);
          expect(subscriber).toHaveBeenCalledWith("value-b");

          // When: -predicateB=value-b → emit undefined
          internalStore.removeMatches(
            sym(uri),
            sym(predicateB),
            literal("value-b"),
          );
          jest.advanceTimersByTime(250);
          expect(subscriber).toHaveBeenCalledWith(undefined);

          // When: +predicateA=value-a2 → emit value-a2
          internalStore.add(sym(uri), sym(predicateA), "value-a2");
          jest.advanceTimersByTime(250);
          expect(subscriber).toHaveBeenCalledWith("value-a2");
        });

        it("emits undefined once when all predicates lose all values in same debounce window", () => {
          // Given: three predicates all have values
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";
          const predicateC = "https://vocab.test/predicate-c";

          internalStore.add(sym(uri), sym(predicateA), "value-a");
          internalStore.add(sym(uri), sym(predicateB), "value-b");
          internalStore.add(sym(uri), sym(predicateC), "value-c");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(
            predicateA,
            predicateB,
            predicateC,
          );
          observable.subscribe(subscriber);

          expect(subscriber.mock.calls[0]).toEqual(["value-a"]);

          // When: all values removed in same debounce window
          internalStore.removeMatches(
            sym(uri),
            sym(predicateA),
            literal("value-a"),
          );
          internalStore.removeMatches(
            sym(uri),
            sym(predicateB),
            literal("value-b"),
          );
          internalStore.removeMatches(
            sym(uri),
            sym(predicateC),
            literal("value-c"),
          );
          jest.advanceTimersByTime(250);

          // Then: should emit undefined exactly once
          expect(subscriber).toHaveBeenCalledTimes(2);
          expect(subscriber.mock.lastCall).toEqual([undefined]);
        });

        it("handles interleaved additions and removals across predicates", () => {
          // Given: two predicates are observed
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(predicateA, predicateB);
          observable.subscribe(subscriber);

          // And store has: predicateA=value-a
          internalStore.add(sym(uri), sym(predicateA), "value-a");
          jest.advanceTimersByTime(250);
          expect(subscriber).toHaveBeenCalledWith("value-a");

          // When: +predicateB=value-b (while predicateA still has value-a)
          internalStore.add(sym(uri), sym(predicateB), "value-b");
          jest.advanceTimersByTime(250);
          // Then: should not emit (predicateA already had value, new value doesn't change "any")
          expect(subscriber.mock.calls.length).toBe(2); // still only 2: undefined, value-a

          // When: -predicateA=value-a
          internalStore.removeMatches(
            sym(uri),
            sym(predicateA),
            literal("value-a"),
          );
          jest.advanceTimersByTime(250);
          // Then: should emit value-b (now predicateA is gone, fall back to predicateB)
          expect(subscriber).toHaveBeenCalledWith("value-b");
        });
      });

      it("handles transitions from undefined to defined to undefined to defined", () => {
        // Given: observeAnyValue(predicate) on empty store
        const uri = "https://jane.doe.example/container/file.ttl#fragment";
        const predicate = "https://vocab.test/predicate";

        const thing = new Thing(uri, store);
        const subscriber = jest.fn();
        const observable = thing.observeAnyValue(predicate);
        observable.subscribe(subscriber);

        // Then: -empty (initial) → undefined
        expect(subscriber).toHaveBeenCalledWith(undefined);

        // When: +value-a → value-a
        internalStore.add(sym(uri), sym(predicate), "value-a");
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledWith("value-a");

        // When: -value-a → undefined
        internalStore.removeMatches(
          sym(uri),
          sym(predicate),
          literal("value-a"),
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledWith(undefined);

        // When: +value-b → value-b
        internalStore.add(sym(uri), sym(predicate), "value-b");
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledWith("value-b");

        // Then: verify all emissions
        expect(subscriber.mock.calls).toEqual([
          [undefined],
          ["value-a"],
          [undefined],
          ["value-b"],
        ]);
      });

      describe("Rapid Changes and Debouncing", () => {
        it("emits once when multiple values removed in same debounce window", () => {
          // Given: a store with multiple values for the same predicate
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicate = "https://vocab.test/predicate";

          internalStore.add(sym(uri), sym(predicate), "value1");
          internalStore.add(sym(uri), sym(predicate), "value2");
          internalStore.add(sym(uri), sym(predicate), "value3");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();

          // And: subscribing to the predicate
          const observable = thing.observeAnyValue(predicate);
          observable.subscribe(subscriber);

          // And: initial value is the first one
          expect(subscriber.mock.calls[0]).toEqual(["value1"]);

          // When: value1 and value2 are removed in the same debounce window
          internalStore.removeMatches(
            sym(uri),
            sym(predicate),
            literal("value1"),
          );
          internalStore.removeMatches(
            sym(uri),
            sym(predicate),
            literal("value2"),
          );
          jest.advanceTimersByTime(250);

          // Then: should emit once with value3 (not twice)
          expect(subscriber).toHaveBeenCalledTimes(2);
          expect(subscriber.mock.lastCall).toEqual(["value3"]);
        });

        it("emits once with new value when remove-then-add happen in same debounce window", () => {
          // Given: a store with one value
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicate = "https://vocab.test/predicate";

          internalStore.add(sym(uri), sym(predicate), "value-a");

          const thing = new Thing(uri, store);
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(predicate);
          observable.subscribe(subscriber);

          expect(subscriber.mock.calls[0]).toEqual(["value-a"]);

          // When: value-a removed and value-b added within the same debounce window
          internalStore.removeMatches(
            sym(uri),
            sym(predicate),
            literal("value-a"),
          );
          internalStore.add(sym(uri), sym(predicate), "value-b");
          jest.advanceTimersByTime(250);

          // Then: should emit only once with value-b (not undefined then value-b)
          expect(subscriber).toHaveBeenCalledTimes(2);
          expect(subscriber.mock.lastCall).toEqual(["value-b"]);
        });
      });

      describe("Consistency with anyValue() semantics", () => {
        it("first emission equals anyValue() at subscription time", () => {
          // Given: a store with multiple predicates and values
          const uri = "https://jane.doe.example/container/file.ttl#fragment";
          const predicateA = "https://vocab.test/predicate-a";
          const predicateB = "https://vocab.test/predicate-b";
          const predicateC = "https://vocab.test/predicate-c";

          internalStore.add(sym(uri), sym(predicateA), "value-a");
          internalStore.add(sym(uri), sym(predicateB), "value-b");
          internalStore.add(sym(uri), sym(predicateC), "value-c");

          const thing = new Thing(uri, store);

          // When: getting anyValue
          const anyValueResult = thing.anyValue(
            predicateA,
            predicateB,
            predicateC,
          );

          // And: observing anyValue
          const subscriber = jest.fn();
          const observable = thing.observeAnyValue(
            predicateA,
            predicateB,
            predicateC,
          );
          observable.subscribe(subscriber);

          // Then: first emission should equal anyValue result
          expect(subscriber.mock.calls[0][0]).toEqual(anyValueResult);
        });
      });
    });
  });
});
