import { graph, lit, sym } from "rdflib";
import { LabelIndex } from "./LabelIndex";

describe("label index", () => {
  describe("get indexed items", () => {
    it("returns nothing if store is empty", () => {
      const index = new LabelIndex(
        "https://pod.example/label-index",
        graph(),
        false,
      );
      const result = index.getIndexedItems();
      expect(result).toEqual([]);
    });

    it("returns a single item and it's label", () => {
      const store = graph();
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("The only item"),
        sym("https://pod.example/label-index"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
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
      const store = graph();
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
      const store = graph();
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
        false,
      );
      const result = index.getIndexedItems();
      expect(result).toEqual([]);
    });
  });

  describe("contains", () => {
    it("returns true if the store contains a label for the given uri", () => {
      const store = graph();
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("An item"),
        sym("https://pod.example/label-index"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(true);
    });

    it("returns false if the store does not contain a label for the given uri", () => {
      const store = graph();
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(false);
    });

    it("returns false if the store contains a label for a different uri", () => {
      const store = graph();
      store.add(
        sym("https://pod.example/other-item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Another item"),
        sym("https://pod.example/label-index"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(false);
    });

    it("returns false if the store contains a label for the given uri but from a different source", () => {
      const store = graph();
      store.add(
        sym("https://pod.example/item#it"),
        sym("http://www.w3.org/2000/01/rdf-schema#label"),
        lit("Label from other source"),
        sym("https://pod.example/other-source"),
      );
      const index = new LabelIndex(
        "https://pod.example/label-index",
        store,
        false,
      );
      const result = index.contains("https://pod.example/item#it");
      expect(result).toBe(false);
    });
  });
});
