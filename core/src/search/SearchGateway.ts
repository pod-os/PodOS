import { WebIdProfile } from "../profile";
import { Store } from "../Store";
import { createDefaultLabelIndex } from "./createDefaultLabelIndex";

export class SearchGateway {
  constructor(private store: Store) {}

  async createDefaultLabelIndex(profile: WebIdProfile) {
    const operation = createDefaultLabelIndex(profile);
    await this.store.executeUpdate(operation);
  }
}
