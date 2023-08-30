import { LabelIndex } from "./LabelIndex";
import lunr from "lunr";

export class SearchIndex {
  private index: any;
  constructor(indexes: LabelIndex[]) {
    this.index = lunr(function () {
      this.ref("uri");
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

  search(query: string) {
    return this.index.search(query);
  }
}
