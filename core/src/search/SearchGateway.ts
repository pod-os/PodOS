import { WebIdProfile } from "../profile";
import { Store } from "../Store";
import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { LabelIndex } from "./LabelIndex";
import { Thing } from "../thing";
import { addToLabelIndex } from "./addToLabelIndex";
import { SearchIndex } from "./SearchIndex";

export class SearchGateway {
  private readonly store: Store;
  private cached?: SearchIndex;

  constructor(store: Store) {
    this.store = store;
  }

  /**
   * Fetch the private label index for the given profile and build a search index from it.
   * Repeated calls return the cached index instance.
   * @param profile
   */
  async buildSearchIndex(profile: WebIdProfile) {
    if (!this.cached) {
      const labelIndexUris = profile.getPrivateLabelIndexes();
      this.cached = await this.buildIndex(labelIndexUris);
    }
    return this.cached;
  }

  /**
   * Clears the cached search index, so that the next call to {@link buildSearchIndex}
   * builds a new index.
   */
  clear() {
    this.cached = undefined;
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
    if (this.cached) {
      this.cached.rebuild();
    }
  }

  async createDefaultLabelIndex(profile: WebIdProfile): Promise<LabelIndex> {
    const operation = createDefaultLabelIndex(profile);
    await this.store.executeUpdate(operation);
    if (this.cached) {
      this.cached = await this.buildIndex(profile.getPrivateLabelIndexes());
    }
    return this.store.get(operation.uri).assume(LabelIndex);
  }
}
