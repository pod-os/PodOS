import { graph, sym, quad, literal } from "rdflib";
import { PodOsSession } from "./authentication";
import { Store } from "./Store";

describe("Store", () => {
  let store: Store;
  const addedQuads = [
    quad(
      sym("http://recipe.test/recipe#1"),
      sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      sym("http://schema.org/Recipe"),
      sym("http://recipe.test/recipe"),
    ),
    quad(
      sym("http://recipe.test/recipe#2"),
      sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      sym("http://schema.org/Recipe"),
      sym("http://recipe.test/recipe"),
    ),
    quad(
      sym("http://movie.test/movie#1"),
      sym("http://schema.org/name"),
      literal("Movie 1"),
      sym("http://movie.test/movie"),
    ),
  ];
  beforeEach(() => {
    const internalStore = graph();
    store = new Store({} as PodOsSession, undefined, undefined, internalStore);
    internalStore.addAll(addedQuads);
  });
  describe("holds", () => {
    it("determines whether a dataset includes a certain quad, returning true or false as appropriate", async () => {
      const test_true = store.holds(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
      );
      const test_false = store.holds(
        sym("http://recipe.test/recipe#missing"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
      );
      expect(test_true).toBe(true);
      expect(test_false).toBe(false);
    });
    it.each([null, undefined])(
      "supports undefined and null wildcards",
      (wildcard: null | undefined) => {
        const test_subject_missing = store.holds(
          wildcard,
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_predicate_missing = store.holds(
          sym("http://recipe.test/recipe#1"),
          wildcard,
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_object_missing = store.holds(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          wildcard,
          sym("http://recipe.test/recipe"),
        );
        const test_graph_missing = store.holds(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          wildcard,
        );
        expect(test_subject_missing).toBe(true);
        expect(test_predicate_missing).toBe(true);
        expect(test_object_missing).toBe(true);
        expect(test_graph_missing).toBe(true);
      },
    );
    it("supports missing args as wildcards", () => {
      const test_graph_missing = store.holds(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
      );
      const test_object_missing = store.holds(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      const test_predicate_missing = store.holds(
        sym("http://recipe.test/recipe#1"),
      );
      const test_subject_missing = store.holds();
      expect(test_subject_missing).toBe(true);
      expect(test_predicate_missing).toBe(true);
      expect(test_object_missing).toBe(true);
      expect(test_graph_missing).toBe(true);
    });
  });

  describe("statementsMatching", () => {
    it("returns array of statements matching a quad pattern", async () => {
      const matching = store.statementsMatching(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
        sym("http://recipe.test/recipe"),
      );
      expect(matching).toEqual([
        quad(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        ),
      ]);
      const empty = store.statementsMatching(
        sym("http://recipe.test/recipe#missing"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
        sym("http://recipe.test/recipe"),
      );
      expect(empty).toEqual([]);
    });
    it.each([null, undefined])(
      "supports undefined and null wildcards",
      (wildcard: null | undefined) => {
        const test_subject_missing = store.statementsMatching(
          wildcard,
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_predicate_missing = store.statementsMatching(
          sym("http://recipe.test/recipe#1"),
          wildcard,
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_object_missing = store.statementsMatching(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          wildcard,
          sym("http://recipe.test/recipe"),
        );
        const test_graph_missing = store.statementsMatching(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          wildcard,
        );
        expect(test_subject_missing).toEqual([
          quad(
            sym("http://recipe.test/recipe#1"),
            sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            sym("http://schema.org/Recipe"),
            sym("http://recipe.test/recipe"),
          ),
          quad(
            sym("http://recipe.test/recipe#2"),
            sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            sym("http://schema.org/Recipe"),
            sym("http://recipe.test/recipe"),
          ),
        ]);
        expect(test_predicate_missing).toEqual([
          quad(
            sym("http://recipe.test/recipe#1"),
            sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            sym("http://schema.org/Recipe"),
            sym("http://recipe.test/recipe"),
          ),
        ]);
        expect(test_object_missing).toEqual([
          quad(
            sym("http://recipe.test/recipe#1"),
            sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            sym("http://schema.org/Recipe"),
            sym("http://recipe.test/recipe"),
          ),
        ]);
        expect(test_graph_missing).toEqual([
          quad(
            sym("http://recipe.test/recipe#1"),
            sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
            sym("http://schema.org/Recipe"),
            sym("http://recipe.test/recipe"),
          ),
        ]);
      },
    );
    it("supports missing args as wildcards", () => {
      const test_graph_missing = store.statementsMatching(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
      );
      const test_object_missing = store.statementsMatching(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      const test_predicate_missing = store.statementsMatching(
        sym("http://recipe.test/recipe#1"),
      );
      const test_subject_missing = store.statementsMatching();
      expect(test_subject_missing).toEqual(addedQuads);
      expect(test_predicate_missing).toEqual([
        quad(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        ),
      ]);
      expect(test_object_missing).toEqual([
        quad(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        ),
      ]);
      expect(test_graph_missing).toEqual([
        quad(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        ),
      ]);
    });
  });

  describe("each", () => {
    it("throws error if no wildcard is present", async () => {
      const missingWildcard = () => {
        store.each(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
      };
      expect(missingWildcard).toThrow("No wildcard specified");
    });
    it.each([null, undefined])(
      "supports undefined and null wildcards",
      (wildcard: null | undefined) => {
        const test_subject_missing = store.each(
          wildcard,
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_predicate_missing = store.each(
          sym("http://recipe.test/recipe#1"),
          wildcard,
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_object_missing = store.each(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          wildcard,
          sym("http://recipe.test/recipe"),
        );
        const test_graph_missing = store.each(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          wildcard,
        );
        expect(test_subject_missing).toEqual([
          sym("http://recipe.test/recipe#1"),
          sym("http://recipe.test/recipe#2"),
        ]);
        expect(test_predicate_missing).toEqual([
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        ]);
        expect(test_object_missing).toEqual([sym("http://schema.org/Recipe")]);
        expect(test_graph_missing).toEqual([sym("http://recipe.test/recipe")]);
      },
    );
    it("supports missing args as wildcards", () => {
      const test_graph_missing = store.each(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
      );
      const test_object_missing = store.each(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      const test_predicate_missing = store.each(
        sym("http://recipe.test/recipe#1"),
      );
      const test_subject_missing = store.each();
      expect(test_subject_missing).toEqual([
        sym("http://recipe.test/recipe#1"),
        sym("http://recipe.test/recipe#2"),
        sym("http://movie.test/movie#1"),
      ]);
      expect(test_predicate_missing).toEqual([
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      ]);
      expect(test_object_missing).toEqual([sym("http://schema.org/Recipe")]);
      expect(test_graph_missing).toEqual([sym("http://recipe.test/recipe")]);
    });
  });

  describe("any", () => {
    it("returns null if no triples match", async () => {
      const result = store.any(
        sym("http://recipe.test/recipe#missing"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
        sym("http://recipe.test/recipe"),
      );
      expect(result).toEqual(null);
    });
    it("otherwise throws error if no wildcard is present", async () => {
      const missingWildcard = () => {
        store.any(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
      };
      expect(missingWildcard).toThrow("No wildcard specified");
    });
    it.each([null, undefined])(
      "returns one term matching undefined or null wildcards",
      (wildcard: null | undefined) => {
        const test_subject_missing = store.any(
          wildcard,
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_predicate_missing = store.any(
          sym("http://recipe.test/recipe#1"),
          wildcard,
          sym("http://schema.org/Recipe"),
          sym("http://recipe.test/recipe"),
        );
        const test_object_missing = store.any(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          wildcard,
          sym("http://recipe.test/recipe"),
        );
        const test_graph_missing = store.any(
          sym("http://recipe.test/recipe#1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
          wildcard,
        );
        expect(test_subject_missing).toEqual(
          sym("http://recipe.test/recipe#1"),
        );
        expect(test_predicate_missing).toEqual(
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        );
        expect(test_object_missing).toEqual(sym("http://schema.org/Recipe"));
        expect(test_graph_missing).toEqual(sym("http://recipe.test/recipe"));
      },
    );
    it("supports missing args as wildcards", () => {
      const test_graph_missing = store.any(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://schema.org/Recipe"),
      );
      const test_object_missing = store.any(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      const test_predicate_missing = store.any(
        sym("http://recipe.test/recipe#1"),
      );
      const test_subject_missing = store.any();
      expect(test_subject_missing).toEqual(sym("http://recipe.test/recipe#1"));
      expect(test_predicate_missing).toEqual(
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      expect(test_object_missing).toEqual(sym("http://schema.org/Recipe"));
      expect(test_graph_missing).toEqual(sym("http://recipe.test/recipe"));
    });
  });

  describe("anyValue", () => {
    it("returns value for matching term from Store.any", () => {
      const result = store.anyValue(
        sym("http://recipe.test/recipe#1"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      expect(result).toEqual("http://schema.org/Recipe");
    });
    it("returns undefined if there is no match", () => {
      const result = store.anyValue(
        sym("http://recipe.test/recipe#missing"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      );
      expect(result).toEqual(undefined);
    });
  });
});
