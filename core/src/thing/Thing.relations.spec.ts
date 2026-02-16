import { blankNode, graph, sym, IndexedFormula, quad } from "rdflib";
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

  describe("observeRelations", () => {
    jest.useFakeTimers();
    it("pushes existing relations immediately and changed relations in groups, until unsubscribe, unless irrelevant", () => {
      const internalStore = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.addAll([
        quad(
          sym(uri),
          sym("http://vocab.test/first"),
          sym("https://pod.example/first"),
        ),
        quad(
          sym(uri),
          sym("http://vocab.test/second"),
          sym("https://pod.example/second"),
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
      const relationsSpy = jest.spyOn(thing, "relations");

      const observable = thing.observeRelations();
      const subscription = observable.subscribe(subscriber);

      // Existing value
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(relationsSpy).toHaveBeenCalledTimes(1);
      // Irrelevant statement about another resource
      internalStore.add(
        sym("http://example.com/other-resource"),
        sym("http://vocab.test/first"),
        sym("https://pod.example/first"),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(relationsSpy).toHaveBeenCalledTimes(1);
      // Changed by removal
      internalStore.removeStatement(
        quad(
          sym(uri),
          sym("http://vocab.test/second"),
          sym("https://pod.example/second"),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(relationsSpy).toHaveBeenCalledTimes(2);
      // Changed by added object
      internalStore.add(
        quad(
          sym(uri),
          sym("http://vocab.test/first"),
          sym("https://pod.example/first-2"),
        ),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(3);
      expect(relationsSpy).toHaveBeenCalledTimes(3);
      // Changed by removing and adding group of statements
      internalStore.removeStatement(
        quad(
          sym(uri),
          sym("http://vocab.test/first"),
          sym("https://pod.example/first-2"),
        ),
      );
      internalStore.removeStatement(
        quad(
          sym(uri),
          sym("http://vocab.test/first"),
          sym("https://pod.example/first"),
        ),
      );
      internalStore.addAll([
        quad(
          sym(uri),
          sym("http://vocab.test/second"),
          sym("https://pod.example/second"),
        ),
        quad(
          sym(uri),
          sym("http://vocab.test/second"),
          sym("https://pod.example/second-1"),
        ),
      ]);
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(4);
      expect(relationsSpy).toHaveBeenCalledTimes(4);
      // Stop listening to ignore future changes
      subscription.unsubscribe();
      internalStore.add(
        sym(uri),
        sym("http://vocab.test/third"),
        sym("https://pod.example/third"),
      );
      jest.advanceTimersByTime(250);
      expect(subscriber).toHaveBeenCalledTimes(4);
      expect(relationsSpy).toHaveBeenCalledTimes(4);
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
