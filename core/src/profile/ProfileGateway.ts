import { WebIdProfile } from "./WebIdProfile";
import { Store } from "../Store";

export class ProfileGateway {
  constructor(private readonly store: Store) {}
  async fetchProfile(webId: string) {
    await this.store.fetch(webId);
    const profile: WebIdProfile = this.store.get(webId).assume(WebIdProfile);
    const preferences = profile.getPreferencesFile();
    if (preferences) {
      await this.store.fetch(preferences);
    }
    const publicTypeIndex = profile.getPublicTypeIndex();
    const privateTypeIndex = profile.getPrivateTypeIndex();
    if (publicTypeIndex) {
      await this.store.fetch(publicTypeIndex);
    }
    if (privateTypeIndex) {
      await this.store.fetch(privateTypeIndex);
    }
    return profile;
  }
}
