import { WebIdProfile } from "./WebIdProfile";
import { Store } from "../Store";

export class ProfileGateway {
  constructor(private readonly store: Store) {}
  async fetchProfile(webId: string): Promise<WebIdProfile> {
    await this.store.fetch(webId);
    const profile: WebIdProfile = this.store.get(webId).assume(WebIdProfile);
    const preferences = profile.getPreferencesFile();
    if (preferences) {
      await this.store.fetch(preferences);
    }
    const publicTypeIndex = profile.getPublicTypeIndex();
    const privateTypeIndex = profile.getPrivateTypeIndex();
    await this.store.fetchAll(
      [privateTypeIndex, publicTypeIndex].filter((it) => it !== undefined),
    );
    return profile;
  }
}
