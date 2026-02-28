import { graph, IndexedFormula, quad, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Relation, Thing } from "./Thing";
import { Store } from "../Store";
import { Observable, Subscription } from "rxjs";

describe("Thing", function () {
  describe("reverse relations", () => {
    let internalStore: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let store: Store;

    beforeEach(() => {
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
    });

    it("are empty, if store is empty", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.reverseRelations()).toEqual([]);
    });

    it("contains a single relation from store", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(
        sym("https://pod.example/resource"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      internalStore.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      internalStore.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym("https://pod.example/first/1"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      internalStore.add(
        sym("https://pod.example/second/1"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      internalStore.add(
        sym("https://pod.example/second/2"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      internalStore.add(
        sym("https://pod.example/third/1"),
        sym("http://vocab.test/third"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
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
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      internalStore.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      const it = new Thing(uri, store);
      const result = it.reverseRelations("http://vocab.test/first");
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          label: "first",
          uris: ["https://pod.example/first"],
        },
      ]);
    });

    it("only contains a uri once even if present in multiple graphs", () => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym(uri),
        sym("https://pod.example/document-1"),
      );
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym(uri),
        sym("https://pod.example/document-2"),
      );
      const it = new Thing(uri, store);
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

  describe("observeReverseRelations", () => {
    jest.useFakeTimers();

    const mockSession = {} as unknown as PodOsSession;
    let store: Store,
      internalStore: IndexedFormula,
      uri: string,
      subscriber: jest.Mock,
      thing: Thing,
      reverseRelationsSpy: jest.SpyInstance,
      observable: Observable<Relation[]>,
      subscription: Subscription;

    beforeEach(() => {
      // Given a store with statements with a URI as object
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
      uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.addAll([
        quad(
          sym("https://pod.example/first"),
          sym("http://vocab.test/first"),
          sym(uri),
        ),
        quad(
          sym("https://pod.example/second"),
          sym("http://vocab.test/second"),
          sym(uri),
        ),
      ]);

      // and a Thing with a reverseRelations method
      subscriber = jest.fn();
      thing = new Thing(uri, store);
      reverseRelationsSpy = jest.spyOn(thing, "reverseRelations");

      // and a subscription to changes in reverse relations
      observable = thing.observeReverseRelations();
      subscription = observable.subscribe(subscriber);
    });

    it("pushes existing reverse relations immediately", () => {
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([
        [
          [
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
          ],
        ],
      ]);
    });

    it("ignores irrelevant statements about other resources", () => {
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym("http://example.com/other-resource"),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(1);
    });

    it("updates after removals", () => {
      internalStore.removeStatement(
        quad(
          sym("https://pod.example/second"),
          sym("http://vocab.test/second"),
          sym(uri),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([
        [
          {
            predicate: "http://vocab.test/first",
            label: "first",
            uris: ["https://pod.example/first"],
          },
        ],
      ]);
    });

    it("updates after added subject", () => {
      internalStore.add(
        quad(
          sym("https://pod.example/first-2"),
          sym("http://vocab.test/first"),
          sym(uri),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([
        [
          {
            predicate: "http://vocab.test/first",
            label: "first",
            uris: ["https://pod.example/first", "https://pod.example/first-2"],
          },
          {
            predicate: "http://vocab.test/second",
            label: "second",
            uris: ["https://pod.example/second"],
          },
        ],
      ]);
    });

    it("pushes changed relations in groups", () => {
      internalStore.removeStatement(
        quad(
          sym("https://pod.example/first"),
          sym("http://vocab.test/first"),
          sym(uri),
        ),
      );
      internalStore.addAll([
        quad(
          sym("https://pod.example/second-1"),
          sym("http://vocab.test/second"),
          sym(uri),
        ),
        quad(
          sym("https://pod.example/second-2"),
          sym("http://vocab.test/second"),
          sym(uri),
        ),
      ]);
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([
        [
          {
            predicate: "http://vocab.test/second",
            label: "second",
            uris: [
              "https://pod.example/second",
              "https://pod.example/second-1",
              "https://pod.example/second-2",
            ],
          },
        ],
      ]);
    });

    it("does not push if relations haven't changed", () => {
      // Identical statement in another document
      internalStore.add(
        quad(
          sym("https://pod.example/first"),
          sym("http://vocab.test/first"),
          sym(uri),
          sym("https://pod.example/another-document"),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("stops pushing after unsubscribe", () => {
      subscription.unsubscribe();
      internalStore.add(
        sym("https://pod.example/third"),
        sym("http://vocab.test/third"),
        sym(uri),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
