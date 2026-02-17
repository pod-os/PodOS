import { graph, IndexedFormula, quad, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

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
  });

  describe("observeReverseRelations", () => {
    jest.useFakeTimers();
    it("pushes existing reverse relations immediately and changed relations in groups, until unsubscribe, unless irrelevant", () => {
      const internalStore = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
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
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      const subscriber = jest.fn();
      const thing = new Thing(uri, store);
      const reverseRelationsSpy = jest.spyOn(thing, "reverseRelations");

      const observable = thing.observeReverseRelations();
      const subscription = observable.subscribe(subscriber);

      // Existing value
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(1);
      // Irrelevant statement about another resource
      internalStore.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym("http://example.com/other-resource"),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(1);
      // Changed by removal
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
      // Changed by added object
      internalStore.add(
        quad(
          sym("https://pod.example/first-2"),
          sym("http://vocab.test/first"),
          sym(uri),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(3);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(3);
      // Changed by removing and adding group of statements
      internalStore.removeStatement(
        quad(
          sym("https://pod.example/first-2"),
          sym("http://vocab.test/first"),
          sym(uri),
        ),
      );
      internalStore.removeStatement(
        quad(
          sym("https://pod.example/first"),
          sym("http://vocab.test/first"),
          sym(uri),
        ),
      );
      internalStore.addAll([
        quad(
          sym("https://pod.example/second"),
          sym("http://vocab.test/second"),
          sym(uri),
        ),
        quad(
          sym("https://pod.example/second-1"),
          sym("http://vocab.test/second"),
          sym(uri),
        ),
      ]);
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(4);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(4);
      // Stop listening to ignore future changes
      subscription.unsubscribe();
      internalStore.add(
        sym("https://pod.example/third"),
        sym("http://vocab.test/third"),
        sym(uri),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(4);
      expect(reverseRelationsSpy).toHaveBeenCalledTimes(4);
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
        [
          [
            {
              predicate: "http://vocab.test/first",
              label: "first",
              uris: ["https://pod.example/first"],
            },
          ],
        ],
        [
          [
            {
              predicate: "http://vocab.test/first",
              label: "first",
              uris: [
                "https://pod.example/first",
                "https://pod.example/first-2",
              ],
            },
          ],
        ],
        [
          [
            {
              predicate: "http://vocab.test/second",
              label: "second",
              uris: [
                "https://pod.example/second",
                "https://pod.example/second-1",
              ],
            },
          ],
        ],
      ]);
    });
  });
});
