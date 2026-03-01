import { graph, IndexedFormula, literal, quad, sym } from "rdflib";
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

  describe("description", () => {
    it("is undefined if nothing is found in store", () => {
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.description()).toBeUndefined();
    });

    it.each([
      "http://purl.org/dc/terms/description",
      "http://purl.org/dc/elements/1.1/description",
      "http://schema.org/description",
      "https://schema.org/description",
      "https://schema.org/text",
      "http://www.w3.org/2000/01/rdf-schema#comment",
      "https://www.w3.org/ns/activitystreams#summary",
      "https://www.w3.org/ns/activitystreams#content",
      "http://www.w3.org/2006/vcard/ns#note",
    ])("returns the literal value of predicate %s", (predicate: string) => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.description();
      expect(result).toEqual("literal value");
    });
  });

  describe("observeDescription", () => {
    const uri = "https://jane.doe.example/container/file.ttl#fragment";

    it("pushes existing value immediately", () => {
      // Given a store with a URI with a description
      const internalStore = graph();
      internalStore.add(
        sym(uri),
        sym("https://schema.org/description"),
        "literal value",
      );

      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);

      // and a Thing
      const subscriber = jest.fn();
      const thing = new Thing(uri, store);

      // and a subscription to changes of label
      const observable = thing.observeDescription();
      observable.subscribe(subscriber);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([["literal value"]]);
    });

    it("is undefined if nothing is found in store", () => {
      const thing = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const subscriber = jest.fn();
      const observable = thing.observeDescription();
      observable.subscribe(subscriber);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.lastCall).toEqual([undefined]);
    });

    it.each([
      "http://purl.org/dc/terms/description",
      "http://purl.org/dc/elements/1.1/description",
      "http://schema.org/description",
      "https://schema.org/description",
      "https://schema.org/text",
      "http://www.w3.org/2000/01/rdf-schema#comment",
      "https://www.w3.org/ns/activitystreams#summary",
      "https://www.w3.org/ns/activitystreams#content",
      "http://www.w3.org/2006/vcard/ns#note",
    ])("returns the literal value of predicate %s", (predicate: string) => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "literal value");
      const thing = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const subscriber = jest.fn();
      const observable = thing.observeDescription();
      observable.subscribe(subscriber);
      expect(subscriber.mock.lastCall).toEqual(["literal value"]);
    });

    describe("follows observeAnyValue behaviour", () => {
      jest.useFakeTimers();

      let subscriber: jest.Mock;

      beforeEach(() => {
        // Given a store with a URI with a description
        internalStore.add(
          quad(
            sym(uri),
            sym("https://schema.org/description"),
            literal("literal value"),
          ),
        );

        // and a Thing with a subscription to changes in description
        subscriber = jest.fn();
        const thing = new Thing(uri, store);
        const observable = thing.observeDescription();
        observable.subscribe(subscriber);
      });

      it("does not push if a description already exists", () => {
        internalStore.add(
          sym(uri),
          sym("https://schema.org/description"),
          "literal value 2",
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledTimes(1);
      });

      it("pushes on remove", () => {
        internalStore.removeStatement(
          quad(
            sym(uri),
            sym("https://schema.org/description"),
            literal("literal value"),
          ),
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.mock.lastCall).toEqual([undefined]);
      });

      it("pushes in a group when description changes", () => {
        internalStore.removeStatement(
          quad(
            sym(uri),
            sym("https://schema.org/description"),
            literal("literal value"),
          ),
        );
        internalStore.add(
          sym(uri),
          sym("https://schema.org/description"),
          "literal value 2",
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.mock.lastCall).toEqual(["literal value 2"]);
      });
    });
  });
});
