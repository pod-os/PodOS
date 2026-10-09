import { WebIdProfile } from "../profile";
import { Store } from "../Store";
import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { LabelIndex } from "./LabelIndex";
import { Thing } from "../thing";
import { addToLabelIndex } from "./addToLabelIndex";
import { SearchIndex } from "./SearchIndex";

export class SearchGateway {
  private readonly store: Store;
  private cached?: { webId: string; index: SearchIndex };

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Fetch the private label index for the given profile and build a search index from it.
   * Repeated calls with the same webId return the cached index instance.
   * @param profile
   */
  async buildSearchIndex(profile: WebIdProfile) {
    if (this.cached?.webId === profile.webId) {
      return this.cached.index;
    }
    const labelIndexUris = profile.getPrivateLabelIndexes();
    const index = await this.buildIndex(labelIndexUris);
    this.cached = { webId: profile.webId, index };
    return index;
  }

  private async buildIndex(labelIndexUris: string[]): Promise<SearchIndex> {
    if (labelIndexUris.length === 0) {
      return new SearchIndex([]);
    }
    await this.store.fetchAll(labelIndexUris);
    const labelIndex = labelIndexUris.map((uri) =>
      this.store.get(uri).assume(LabelIndex),
    );
    return new SearchIndex(labelIndex);
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
