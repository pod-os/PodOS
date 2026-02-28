import { graph, sym, IndexedFormula, quad } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";
import { Subscription } from "rxjs";

describe("Thing", function () {
  describe("types", () => {
    let internalStore: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let store: Store;

    beforeEach(() => {
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
    });

    it("are empty if nothing is found in store", () => {
      const it = new Thing("https://jane.doe.example/resource#it", store);
      expect(it.types()).toEqual([]);
    });

    it("contains the single type of a resource", () => {
      const it = new Thing("https://jane.doe.example/resource#it", store);
      internalStore.add(
        sym("https://jane.doe.example/resource#it"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeA"),
      );
      expect(it.types()).toEqual([
        {
          uri: "https://vocab.example#TypeA",
          label: "TypeA",
        },
      ]);
    });

    it("contains all the types of a resource", () => {
      const it = new Thing("https://jane.doe.example/resource#it", store);
      internalStore.add(
        sym("https://jane.doe.example/resource#it"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeA"),
      );
      internalStore.add(
        sym("https://jane.doe.example/resource#it"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeB"),
      );
      internalStore.add(
        sym("https://jane.doe.example/resource#it"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeC"),
      );
      const types = it.types();
      expect(types).toContainEqual({
        uri: "https://vocab.example#TypeA",
        label: "TypeA",
      });
      expect(types).toContainEqual({
        uri: "https://vocab.example#TypeB",
        label: "TypeB",
      });
      expect(types).toContainEqual({
        uri: "https://vocab.example#TypeC",
        label: "TypeC",
      });
      expect(types).toHaveLength(3);
    });

    it("does not contain types of other things or other properties of the thing", () => {
      const it = new Thing("https://jane.doe.example/resource#it", store);
      internalStore.add(
        sym("https://jane.doe.example/resource#other"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeA"),
      );
      internalStore.add(
        sym("https://jane.doe.example/resource#it"),
        sym("https://vocab.example#notAType"),
        sym("https://vocab.example#TypeB"),
      );
      expect(it.types()).toEqual([]);
    });
  });

  describe("observeTypes", () => {
    let internalStore: IndexedFormula,
      uri: string,
      subscriber: jest.Mock,
      subscription: Subscription;

    beforeEach(() => {
      // Given a store with a type statement about a URI
      internalStore = graph();
      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);
      uri = "http://recipe.test/0";
      internalStore.add(
        quad(
          sym(uri),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );

      // and a Thing
      const thing = new Thing(uri, store);

      // and a subscription to changes in types
      subscriber = jest.fn();
      const observable = thing.observeTypes();
      subscription = observable.subscribe(subscriber);
    });

    it("pushes existing value immediately", () => {
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([
        [
          [
            {
              uri: "http://schema.org/Recipe",
              label: "Recipe",
            },
          ],
        ],
      ]);
    });

    it("ignores irrelevant statements about another resource", () => {
      internalStore.add(
        quad(
          sym("http://recipe.test/a-different-recipe"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("updates value when added", () => {
      internalStore.add(
        quad(
          sym(uri),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://example.com/Recipe2"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([
        [
          {
            uri: "http://schema.org/Recipe",
            label: "Recipe",
          },
          {
            uri: "http://example.com/Recipe2",
            label: "Recipe2",
          },
        ],
      ]);
    });

    it("updates value when removed", () => {
      internalStore.removeStatement(
        quad(
          sym(uri),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([[]]);
    });

    it("updates when a subclass is added", () => {
      internalStore.add(
        quad(
          sym("http://schema.org/Recipe"),
          sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"),
          sym("http://schema.org/Thing"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.lastCall).toEqual([
        [
          {
            uri: "http://schema.org/Recipe",
            label: "Recipe",
          },
          {
            uri: "http://schema.org/Thing",
            label: "Thing",
          },
        ],
      ]);
    });

    it("does not update if a new subclass is irrelevant", () => {
      internalStore.add(
        quad(
          sym("http://schema.org/Video"),
          sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"),
          sym("http://schema.org/Thing"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("does not update after unsubscribe", () => {
      subscription.unsubscribe();
      internalStore.removeStatement(
        quad(
          sym(uri),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(1);
    });
  });
});
