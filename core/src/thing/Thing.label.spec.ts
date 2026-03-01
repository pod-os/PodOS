import { graph, IndexedFormula, literal, quad, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("label", () => {
    let internalStore: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let store: Store;

    beforeEach(() => {
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
    });

    describe("if nothing is found in the store", () => {
      it.each([
        "https://jane.doe.example/container/file.ttl#fragment",
        "https://jane.doe.example#fragment",
      ])("the fragment is used", (uri) => {
        const it = new Thing(uri, store);
        expect(it.label()).toBe("fragment");
      });

      it("the file name is used, if no fragment is given", () => {
        const it = new Thing(
          "https://jane.doe.example/container/file.ttl",
          store,
        );
        expect(it.label()).toBe("file.ttl");
      });

      it("container name is used if no file is present", () => {
        const it = new Thing("https://jane.doe.example/container/", store);
        expect(it.label()).toBe("container");
      });

      describe("if fragments are too generic", () => {
        it.each([
          { uri: "https://jane.doe.example/resource#it", label: "resource#it" },
          {
            uri: "https://jane.doe.example/resource#this",
            label: "resource#this",
          },
          { uri: "https://jane.doe.example/profile/card#me", label: "card#me" },
          { uri: "https://jane.doe.example/#i", label: "jane.doe.example/#i" },
          { uri: "https://jane.doe.example/profile/#me", label: "profile/#me" },
        ])("file and fragment are both used", ({ uri, label }) => {
          const it = new Thing(uri, store);
          expect(it.label()).toBe(label);
        });
      });

      it("the host name is used, if no path is given", () => {
        const it = new Thing("https://jane.doe.example/", store);
        expect(it.label()).toBe("jane.doe.example");
      });
    });

    it.each([
      "http://xmlns.com/foaf/0.1/nick",
      "http://purl.org/dc/terms/title",
      "http://purl.org/dc/elements/1.1/title",
      "http://xmlns.com/foaf/0.1/name",
      "http://schema.org/name",
      "https://schema.org/name",
      "http://www.w3.org/2000/01/rdf-schema#label",
      "https://www.w3.org/ns/activitystreams#name",
      "http://www.w3.org/2006/vcard/ns#fn",
      "http://schema.org/caption",
      "https://schema.org/caption",
    ])("returns the literal value of predicate %s", (predicate: string) => {
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      internalStore.add(sym(uri), sym(predicate), "literal value");
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.label();
      expect(result).toEqual("literal value");
    });
  });

  describe("observeLabel", () => {
    const uri = "https://jane.doe.example/container/file.ttl#fragment";

    it("pushes existing value immediately", () => {
      // Given a store with statements about a URI
      const internalStore = graph();
      internalStore.add(
        sym(uri),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        "literal value",
      );

      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);

      // and a Thing
      const subscriber = jest.fn();
      const thing = new Thing(uri, store);

      // and a subscription to changes of label
      const observable = thing.observeLabel();
      observable.subscribe(subscriber);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([["literal value"]]);
    });

    it("uses same value as label() when nothing is present in store", () => {
      // Given an empty store
      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession);

      // and a Thing
      const subscriber = jest.fn();
      const thing = new Thing(uri, store);

      // and a subscription to changes of label
      const observable = thing.observeLabel();
      observable.subscribe(subscriber);

      expect(subscriber.mock.lastCall).toEqual([thing.label()]);
    });

    it.each([
      "http://xmlns.com/foaf/0.1/nick",
      "http://purl.org/dc/terms/title",
      "http://purl.org/dc/elements/1.1/title",
      "http://xmlns.com/foaf/0.1/name",
      "http://schema.org/name",
      "https://schema.org/name",
      "http://www.w3.org/2000/01/rdf-schema#label",
      "https://www.w3.org/ns/activitystreams#name",
      "http://www.w3.org/2006/vcard/ns#fn",
      "http://schema.org/caption",
      "https://schema.org/caption",
    ])("returns the literal value of predicate %s", (predicate: string) => {
      // Given a store with label for a URI using this predicate
      const internalStore = graph();
      internalStore.add(sym(uri), sym(predicate), "literal value");
      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);

      // and a Thing
      const subscriber = jest.fn();
      const thing = new Thing(uri, store);

      // and a subscription to changes of label
      const observable = thing.observeLabel();
      observable.subscribe(subscriber);

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([["literal value"]]);
    });

    describe("follows observeAnyValue behaviour", () => {
      jest.useFakeTimers();

      let internalStore: IndexedFormula, subscriber: jest.Mock;

      beforeEach(() => {
        // Given a store with a URI with a label
        internalStore = graph();
        internalStore.add(
          quad(
            sym(uri),
            sym("http://www.w3.org/2000/01/rdf-schema#label"),
            literal("literal value"),
          ),
        );

        const mockSession = {} as unknown as PodOsSession;
        const store = new Store(
          mockSession,
          undefined,
          undefined,
          internalStore,
        );

        // and a Thing
        subscriber = jest.fn();
        const thing = new Thing(uri, store);

        // and a subscription to changes of label
        const observable = thing.observeLabel();
        observable.subscribe(subscriber);
      });

      it("does not push if a label already exists", () => {
        internalStore.add(
          sym(uri),
          sym("http://www.w3.org/2000/01/rdf-schema#label"),
          "literal value 2",
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledTimes(1);
      });

      it("pushes on remove", () => {
        internalStore.removeStatement(
          quad(
            sym(uri),
            sym("http://www.w3.org/2000/01/rdf-schema#label"),
            literal("literal value"),
          ),
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.mock.lastCall).toEqual(["fragment"]);
      });

      it("pushes in a group when label changes", () => {
        internalStore.removeStatement(
          quad(
            sym(uri),
            sym("http://www.w3.org/2000/01/rdf-schema#label"),
            literal("literal value"),
          ),
        );
        internalStore.add(
          sym(uri),
          sym("http://www.w3.org/2000/01/rdf-schema#label"),
          "literal value 2",
        );
        jest.advanceTimersByTime(250);
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber.mock.lastCall).toEqual(["literal value 2"]);
      });
    });
  });
});
