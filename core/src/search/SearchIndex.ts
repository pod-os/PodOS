import { LabelIndex } from "./LabelIndex";
import lunr, { Index } from "lunr";

export class SearchIndex {
  private index: Index;
  constructor(indexes: LabelIndex[]) {
    this.index = lunr(function () {
      this.ref("uri");
      this.field("uri");
      this.field("label");
      this.metadataWhitelist = ["position"];

      const items = indexes.flatMap((it) => it.getIndexedItems());

      items.forEach((item) => {
        this.add({
          uri: item.uri,
          label: item.label,
        });
      });
    });
  }

  search(term: string) {
    const escapedTerm = term.replace(/[~^+:]/g, (x) => `\\${x}`);
    return this.index.search(
      `${escapedTerm}^100 ${escapedTerm}*^20 *${escapedTerm}^10 *${escapedTerm}*^5`,
    );
  }

  clear() {
    this.index = lunr(() => {});
  }
}
