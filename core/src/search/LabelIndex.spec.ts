import { graph, IndexedFormula, lit, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { LabelIndex } from "./LabelIndex";
import { Store } from "../Store";

describe("label index", () => {
  let store: IndexedFormula;
  const mockSession = {} as unknown as PodOsSession;
  let reactiveStore: Store;

  beforeEach(() => {
    store = graph();
    reactiveStore = new Store(mockSession, undefined, undefined, store);
  });

  describe("get indexed items", () => {
    it("returns nothing if store is empty", () => {
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.getIndexedItems();
      expect(result).toEqual([]);
    });

    it("returns a single item and it's label", () => {
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("The only item"),
        sym("https://pod.example/label-index"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.getIndexedItems();
      expect(result).toEqual([
        {
          uri: "https://pod.example/item#it",
          label: "The only item",
        },
      ]);
    });

    it("returns multiple items and their labels", () => {
      store.add(
        sym("https://pod.example/item1#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("First item"),
        sym("https://pod.example/label-index"),
      );
      store.add(
        sym("https://pod.example/item2#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Second item"),
        sym("https://pod.example/label-index"),
      );
      store.add(
        sym("https://pod.example/item3#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Third item"),
        sym("https://pod.example/label-index"),
      );

      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.getIndexedItems();
      expect(result).toEqual([
        {
          uri: "https://pod.example/item1#it",
          label: "First item",
        },
        {
          uri: "https://pod.example/item2#it",
          label: "Second item",
        },
        {
          uri: "https://pod.example/item3#it",
          label: "Third item",
        },
      ]);
    });

    it("ignores labels that do not originate from the index document", () => {
      store.add(
        sym("https://pod.example/item#it"),
        sym("https://vovab.example"),
        lit("irrelevant statement"),
        sym("https://pod.example/label-index"),
      );
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Label from other source"),
        sym("https://pod.example/other-source"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.getIndexedItems();
      expect(result).toEqual([]);
    });
  });

  describe("contains", () => {
    it("returns true if the store contains a label for the given uri", () => {
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("An item"),
        sym("https://pod.example/label-index"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(true);
    });

    it("returns false if the store does not contain a label for the given uri", () => {
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(false);
    });

    it("returns false if the store contains a label for a different uri", () => {
      store.add(
        sym("https://pod.example/other-item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Another item"),
        sym("https://pod.example/label-index"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(false);
    });

    it("returns false if the store contains a label for the given uri but from a different source", () => {
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Label from other source"),
        sym("https://pod.example/other-source"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        reactiveStore,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(false);
    });
  });
});
