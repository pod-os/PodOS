import { graph, sym, IndexedFormula } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("types", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("are empty is nothing is found in store", () => {
      const it = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
      );
      expect(it.types()).toEqual([]);
    });

    it("contains the single type of a resource", () => {
      const it = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
      );
      store.add(
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
      const it = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
      );
      store.add(
        sym("https://jane.doe.example/resource#it"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeA"),
      );
      store.add(
        sym("https://jane.doe.example/resource#it"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeB"),
      );
      store.add(
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
      const it = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
      );
      store.add(
        sym("https://jane.doe.example/resource#other"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("https://vocab.example#TypeA"),
      );
      store.add(
        sym("https://jane.doe.example/resource#it"),
        sym("https://vocab.example#notAType"),
        sym("https://vocab.example#TypeB"),
      );
      expect(it.types()).toEqual([]);
    });
  });
});
