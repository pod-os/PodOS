import { graph, sym, IndexedFormula, quad } from "rdflib";
import { PodOsSession } from "../authentication";
import { RdfType, Thing } from "./Thing";
import { Store } from "../Store";
import { Observable, Subscription } from "rxjs";

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
    it("pushes existing value immediately and changed values until unsubscribe unless irrelevant", () => {
      const internalStore = graph();
      internalStore.add(
        quad(
          sym("http://recipe.test/0"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      const subscriber = jest.fn();
      const thing = new Thing("http://recipe.test/0", store);
      const observable = thing.observeTypes();
      const subscription = observable.subscribe(subscriber);

      // Existing value
      expect(subscriber).toHaveBeenCalledTimes(1);
      internalStore.add(
        quad(
          sym("http://recipe.test/0"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://example.com/Recipe2"),
        ),
      );
      // Irrelevant statement about another resource
      internalStore.add(
        quad(
          sym("http://recipe.test/a-different-recipe"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
      // Changed by removal
      internalStore.removeStatement(
        quad(
          sym("http://recipe.test/0"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://example.com/Recipe2"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(3);
      // Changed by added subclass
      internalStore.add(
        quad(
          sym("http://schema.org/Recipe"),
          sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"),
          sym("http://schema.org/Thing"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(4);
      // Irrelevant subclass doesn't change types
      internalStore.add(
        quad(
          sym("http://schema.org/Video"),
          sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"),
          sym("http://schema.org/Thing"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(4);
      expect(subscriber.mock.calls).toEqual([
        [
          [
            {
              uri: "http://schema.org/Recipe",
              label: "Recipe",
            },
          ],
        ],
        [
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
        ],
        [
          [
            {
              uri: "http://schema.org/Recipe",
              label: "Recipe",
            },
          ],
        ],
        [
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
        ],
      ]);

      // Stop listening to ignore future changes
      subscription.unsubscribe();
      internalStore.removeStatement(
        quad(
          sym("http://recipe.test/0"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(4);
    });
  });
});
