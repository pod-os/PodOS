import { WebIdProfile } from "../profile";
import { Store } from "../Store";
import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { LabelIndex } from "./LabelIndex";
import { Thing } from "../thing";
import { addToLabelIndex } from "./addToLabelIndex";

export class SearchGateway {
  constructor(private store: Store) {}

  async addToLabelIndex(thing: Thing, labelIndex: LabelIndex) {
    await this.store.executeUpdate(addToLabelIndex(thing, labelIndex));
  }

  async createDefaultLabelIndex(profile: WebIdProfile): Promise<LabelIndex> {
    const operation = createDefaultLabelIndex(profile);
    await this.store.executeUpdate(operation);
    return this.store.get(operation.uri).assume(LabelIndex);
  }
}
