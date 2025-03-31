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

    it("find labels with dashes", () => {
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

    it("find labels with special chars", () => {
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

    describe("multiple indexes", () => {
      it("finds resuls from both indexes", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/ec51a17#it", label: "item one" },
            ],
          } as unknown as LabelIndex,
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/9cc2c105#it", label: "item two" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("item");
        expect(result).toHaveLength(2);
        expect(result[0].ref).toEqual("https://pod.example/ec51a17#it");
        expect(result[1].ref).toEqual("https://pod.example/9cc2c105#it");
      });
    });

    describe("max results", () => {
      it("returns max 10 results by default", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/1#it", label: "match-1" },
              { uri: "https://pod.example/2#it", label: "match-2" },
              { uri: "https://pod.example/3#it", label: "match-3" },
              { uri: "https://pod.example/4#it", label: "match-4" },
              { uri: "https://pod.example/5#it", label: "match-5" },
              { uri: "https://pod.example/6#it", label: "match-6" },
              { uri: "https://pod.example/7#it", label: "match-7" },
              { uri: "https://pod.example/8#it", label: "match-8" },
              { uri: "https://pod.example/9#it", label: "match-9" },
              { uri: "https://pod.example/10#it", label: "match-10" },
              { uri: "https://pod.example/11#it", label: "match-11" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("match");
        expect(result).toHaveLength(10);
      });

      it("returns configured max results", () => {
        const index = new SearchIndex([
          {
            getIndexedItems: () => [
              { uri: "https://pod.example/1#it", label: "match-1" },
              { uri: "https://pod.example/2#it", label: "match-2" },
              { uri: "https://pod.example/3#it", label: "match-3" },
            ],
          } as unknown as LabelIndex,
        ]);
        const result = index.search("match", 2);
        expect(result).toHaveLength(2);
      });
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

  describe("rebuild", () => {
    it("finds items after rebuilding the index with new data", () => {
      const index = new SearchIndex([
        {
          getIndexedItems: jest
            .fn()
            .mockReturnValueOnce([])
            .mockReturnValueOnce([
              { uri: "https://pod.example/profile#me", label: "Alice" },
            ]),
        } as unknown as LabelIndex,
      ]);
      const result = index.search("alice");
      expect(result).toEqual([]);
      const updatedResult = index.rebuild().search("alice");
      expect(updatedResult).toHaveLength(1);
      expect(updatedResult[0].ref).toEqual("https://pod.example/profile#me");
    });
  });
});
