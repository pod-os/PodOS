import { LabelIndex } from "./LabelIndex";
import { SearchIndex } from "./SearchIndex";

describe("search index", () => {
  describe("search", () => {
    describe("find nothing", () => {
      it("if there is no index", () => {
        const index = new SearchIndex([]);
        const result = index.search("anything");
        expect(result).toEqual([]);
      });

      it("if index is empty", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("anything");
        expect(result).toEqual([]);
      });
    });

    describe("exact matches", () => {
      it("finds an item that is an exact match", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/item#it", label: "item" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("item");
        expect(result).toHaveLength(1);
        expect(result[0].ref).toEqual("https://pod.example/item#it");
      });

      it("exact match is the first match, even if others are similar", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/item#a", label: "Item A" },
              { uri: "https://pod.example/item#b", label: "Item B" },
              { uri: "https://pod.example/item#c", label: "Item C" },
            ],
          } as unknown as LabelIndex,
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

    it.each(["donau", "dampf", "schiff", "fahrt", "pfsch", "aud", "fff"])(
      "finds parts in a word (e.g. %s within Donaudampfschifffahrt)",
      (query) => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              {
                uri: "https://pod.example/item#it",
                label: "Donaudampfschifffahrt",
              },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search(query);
        expect(result).toHaveLength(1);
        expect(result[0].ref).toEqual("https://pod.example/item#it");
      },
    );
  });

  describe("clear", () => {
    it("does not find anything after clearing", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            { uri: "https://pod.example/item#it", label: "item" },
          ],
        } as unknown as LabelIndex,
      ]);
      index.clear();
      const result = index.search("item");
      expect(result).toHaveLength(0);
    });
  });
});
