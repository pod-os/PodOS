import { graph, sym } from "rdflib";
import { LabelIndex } from "./LabelIndex";
import { SearchIndex } from "./SearchIndex";

describe("search index", () => {
  describe("search", () => {
    it("should find nothing if nothing is index", () => {
      const index = new SearchIndex([]);
      const result = index.search("anything");
      expect(result).toEqual([]);
    });

    it("should not find anything if index is empty", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [],
        } as LabelIndex,
      ]);
      const result = index.search("anything");
      expect(result).toEqual([]);
    });

    it("should find an item that is an exact match", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            { uri: "https://pod.example/item#it", label: "item" },
          ],
        } as LabelIndex,
      ]);
      const result = index.search("item");
      expect(result).toHaveLength(1);
      expect(result[0].ref).toEqual("https://pod.example/item#it");
    });

    it("exact match should be first match, even if others are similar", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            { uri: "https://pod.example/item#a", label: "Item A" },
            { uri: "https://pod.example/item#b", label: "Item B" },
            { uri: "https://pod.example/item#c", label: "Item C" },
          ],
        } as LabelIndex,
      ]);
      const result = index.search("Item A");
      expect(result).toHaveLength(3);
      expect(result[0].ref).toEqual("https://pod.example/item#a");
      expect(result[0].score).toBeGreaterThan(result[1].score);
      expect(result[0].score).toBeGreaterThan(result[2].score);
      expect(result[1].ref).toEqual("https://pod.example/item#b");
      expect(result[2].ref).toEqual("https://pod.example/item#c");
    });
  });
});
