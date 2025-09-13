import { graph, IndexedFormula, literal, quad, sym } from "rdflib";
import { PodOsSession } from "./authentication";
import { Store } from "./Store";
import { Subject } from "rxjs";

describe("Store", () => {
  describe("findMembers", () => {
    it("finds instances of classes and subclasses", () => {
      const internalStore = graph();
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      internalStore.addAll([
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://recipe.test/RecipeClass"),
          sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://recipe.test/2"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://recipe.test/RecipeClass"),
        ),
        quad(
          sym("http://movie.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://movie.test/MovieClass"),
        ),
      ]);
      const members = store.findMembers("http://schema.org/Recipe");
      expect(members).toContain("http://recipe.test/1");
      expect(members).toContain("http://recipe.test/2");
      expect(members).toEqual(
        expect.not.arrayContaining(["http://movie.test/1"]),
      );
    });
  });

  describe("observeFindMembers", () => {
    let internalStore: IndexedFormula,
      store: Store,
      subscriber: jest.Mock,
      stop$: Subject<void>;
    beforeEach(() => {
      internalStore = graph();
      internalStore.add(
        quad(
          sym("http://recipe.test/0"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      subscriber = jest.fn();
      stop$ = new Subject<void>();
      store
        .observeFindMembers("http://schema.org/Recipe", stop$)
        .subscribe(subscriber);
    });

    //To avoid memory leak
    afterEach(() => {
      stop$.next();
      stop$.unsubscribe();
    });

    it("pushes existing values immediately", () => {
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([[["http://recipe.test/0"]]]);
    });

    it("pushes new values until stop", () => {
      internalStore.add(
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber.mock.calls).toEqual([
        [["http://recipe.test/0"]],
        [["http://recipe.test/0", "http://recipe.test/1"]],
      ]);

      // Stop listening to ignore future changes
      stop$.next();
      internalStore.add(
        quad(
          sym("http://recipe.test/2"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it("does not push values if predicate rdf:type is not present", () => {
      internalStore.add(
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/2000/01/rdf-schema#label"),
          literal("Recipe 1"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("only pushes value if number of members has changed", () => {
      internalStore.addAll([
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://movie.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://movie.test/MovieClass"),
        ),
      ]);
      expect(subscriber).toHaveBeenCalledTimes(2);
      internalStore.add(
        quad(
          sym("http://recipe.test/2"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      );
      expect(subscriber).toHaveBeenCalledTimes(3);
      expect(subscriber.mock.calls).toEqual([
        [["http://recipe.test/0"]],
        [["http://recipe.test/0", "http://recipe.test/1"]],
        [
          [
            "http://recipe.test/0",
            "http://recipe.test/1",
            "http://recipe.test/2",
          ],
        ],
      ]);
    });
  });
});
