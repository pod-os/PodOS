import { WebIdProfile } from "../profile";
import { Store } from "../Store";
import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { LabelIndex } from "./LabelIndex";
import { Thing } from "../thing";
import { addToLabelIndex } from "./addToLabelIndex";
import { SearchIndex } from "./SearchIndex";

export class SearchGateway {
  constructor(private store: Store) {}

  /**
   * Fetch the private label index for the given profile and build a search index from it
   * @param profile
   */
  async buildSearchIndex(profile: WebIdProfile) {
    const labelIndexUris = profile.getPrivateLabelIndexes();
    if (labelIndexUris.length > 0) {
      await this.store.fetchAll(labelIndexUris);
      const labelIndex = labelIndexUris.map((uri) =>
        this.store.get(uri).assume(LabelIndex),
      );
      return new SearchIndex(labelIndex);
    }
    return new SearchIndex([]);
  }

  async addToLabelIndex(thing: Thing, labelIndex: LabelIndex) {
    await this.store.executeUpdate(addToLabelIndex(thing, labelIndex));
  }

  async createDefaultLabelIndex(profile: WebIdProfile): Promise<LabelIndex> {
    const operation = createDefaultLabelIndex(profile);
    await this.store.executeUpdate(operation);
    return this.store.get(operation.uri).assume(LabelIndex);
  }
}
