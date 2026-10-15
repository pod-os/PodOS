import { WebIdProfile } from "../profile";
import { ProfileGateway } from "../profile";
import { Store } from "../Store";
import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { LabelIndex } from "./LabelIndex";
import { PodOsSession } from "../authentication";
import { Thing } from "../thing";
import { addToLabelIndex } from "./addToLabelIndex";
import { SearchIndex } from "./SearchIndex";

export class SearchGateway {
  private readonly store: Store;
  private readonly profileGateway: ProfileGateway;
  private readonly session: PodOsSession;
  private cached?: SearchIndex;

  constructor(
    store: Store,
    session: PodOsSession,
    profileGateway: ProfileGateway,
  ) {
    this.store = store;
    this.session = session;
    this.profileGateway = profileGateway;
  }

  /**
   * Build a search index on demand.
   *
   * While logged in, the profile is resolved from the current session's webId
   * and the index is built from the profile's label indexes and cached, so that
   * repeated calls return the same instance.
   *
   * While logged out, a fresh empty index is returned that is NOT cached —
   * the next call after login is a cache miss and builds.
   */
  async buildSearchIndex() {
    const webId = this.session.observeSession().getValue().webId;
    if (!webId) {
      this.clear();
      return new SearchIndex([]);
    }
    const profile = await this.profileGateway.fetchProfile(webId);
    if (!this.cached) {
      const labelIndexUris = profile.getPrivateLabelIndexes();
      this.cached = await this.buildIndex(labelIndexUris);
    }
    return this.cached;
  }

  /**
   * Empties the cached search index in place and drops the cache reference, so
   * that consumers already holding the instance see an empty index immediately
   * and the next call to {@link buildSearchIndex} builds a new index.
   */
  clear() {
    this.cached?.clear();
    this.cached = undefined;
  }

  private async buildIndex(labelIndexUris: string[]): Promise<SearchIndex> {
    const labelIndex = await this.resolveLabelIndexes(labelIndexUris);
    return new SearchIndex(labelIndex);
  }

  private async resolveLabelIndexes(
    labelIndexUris: string[],
  ): Promise<LabelIndex[]> {
    await this.store.fetchAll(labelIndexUris);
    return labelIndexUris.map((uri) =>
      this.store.get(uri).assume(LabelIndex),
    );
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
      this.cached.rebuild(
        await this.resolveLabelIndexes(profile.getPrivateLabelIndexes()),
      );
    }
    return this.store.get(operation.uri).assume(LabelIndex);
  }
}
