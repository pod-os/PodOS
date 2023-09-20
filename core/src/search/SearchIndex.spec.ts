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
              { uri: "https://pod.example/ec51a17#it", label: "item" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("item");
        expect(result).toHaveLength(1);
        expect(result[0].ref).toEqual("https://pod.example/ec51a17#it");
      });

      it("finds an item that is an exact match of two words", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/ec51a17#it", label: "perfect match" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("perfect match");
        expect(result).toHaveLength(1);
        expect(result[0].ref).toEqual("https://pod.example/ec51a17#it");
      });

      it("exact match is the first match, even if others are similar", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/d11872fd#a", label: "item one" },
              {
                uri: "https://pod.example/5e2a2e17#b",
                label: "item two",
              },
              { uri: "https://pod.example/dcc36476#c", label: "item three" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("item two");
        expect(result).toHaveLength(3);
        expect(result[0].ref).toEqual("https://pod.example/5e2a2e17#b");
        expect(result[0].score).toBeGreaterThan(result[1].score);
        expect(result[0].score).toBeGreaterThan(result[2].score);
        expect(result[1].ref).toEqual("https://pod.example/d11872fd#a");
        expect(result[2].ref).toEqual("https://pod.example/dcc36476#c");
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

    it("finds mathing URI", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            { uri: "https://pod.example/profile#me", label: "alice" },
          ],
        } as unknown as LabelIndex,
      ]);
      const result = index.search("https://pod.example/profile#me");
      expect(result).toHaveLength(1);
      expect(result[0].ref).toEqual("https://pod.example/profile#me");
    });

    fit("find labels with dashes", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            {
              uri: "https://pod.example/thing#it",
              label: "my-thing",
            },
          ],
        } as unknown as LabelIndex,
      ]);
      const result = index.search("my-thing");
      expect(result).toHaveLength(1);
      expect(result[0].ref).toEqual("https://pod.example/thing#it");
    });

    fit("find labels with special chars", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            {
              uri: "https://pod.example/thing#it",
              label: "this~is^a+valid:term",
            },
          ],
        } as unknown as LabelIndex,
      ]);
      const result = index.search("this~is^a+valid:term");
      expect(result).toHaveLength(1);
      expect(result[0].ref).toEqual("https://pod.example/thing#it");
    });

    // https://github.com/olivernn/lunr.js/issues/256#issuecomment-294935042
    it("finds Alice, even if stemmed to alic", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: () => [
            { uri: "https://pod.example/profile#me", label: "Alice" },
          ],
        } as unknown as LabelIndex,
      ]);
      const result = index.search("alice");
      expect(result).toHaveLength(1);
      expect(result[0].ref).toEqual("https://pod.example/profile#me");
    });
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
