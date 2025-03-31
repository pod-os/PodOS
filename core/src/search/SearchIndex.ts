import { LabelIndex } from "./LabelIndex";
import lunr, { Index } from "lunr";

/**
 * A fast, in-memory search index based on data from label indexes. Both labels and URIs are indexed.
 */
export class SearchIndex {
  private index: Index;
  constructor(private labelIndexes: LabelIndex[]) {
    this.index = this.rebuild().index;
  }

  /**
   * Recreates the search index with the current data from all label indexes
   */
  rebuild() {
    const labelIndexes = this.labelIndexes;
    this.index = lunr(function () {
      this.ref("uri");
      this.field("uri");
      this.field("label");
      this.metadataWhitelist = ["position"];

      const items = labelIndexes.flatMap((it) => it.getIndexedItems());

      items.forEach((item) => {
        this.add({
          uri: item.uri,
          label: item.label,
        });
      });
    });
    return this;
  }

  /**
   * Search the index for a given term. It finds partial matches, but will rank exact matches higher.
   *
   * The rank order is:
   *
   *  1. exact matches
   *  2. prefix matches
   *  3. suffix matches
   *  4. any matches inside a literal
   *
   * @param term The (partial) term to search for
   * @param maxResults The maximum number of results to return (defaults to 10)
   */
  search(term: string, maxResults = 10) {
    const escapedTerm = term.replace(/[~^+:]/g, (x) => `\\${x}`);
    return this.index
      .search(
        `${escapedTerm}^100 ${escapedTerm}*^20 *${escapedTerm}^10 *${escapedTerm}*^5`,
      )
      .slice(0, maxResults);
  }

  /**
   * Remove all data from the search index.
   */
  clear() {
    this.index = lunr(() => {});
  }
}
