import { IndexedFormula, sym } from "rdflib";
import { Thing } from "../thing";

export class WebIdProfile extends Thing {
  constructor(
    readonly webId: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(webId, store, editable);
  }

  getPreferencesFile() {
    return this.store.anyValue(
      sym(this.webId),
      sym("http://www.w3.org/ns/pim/space#preferencesFile"),
      undefined,
      sym(this.webId).doc(),
    );
  }

  getPrivateLabelIndex() {
    const index = this.store.anyValue(
      sym(this.webId),
      sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
      undefined,
      sym(this.webId).doc(),
    );
    if (index) {
      return index;
    } else {
      const preferences = this.getPreferencesFile();
      if (preferences) {
        return this.store.anyValue(
          sym(this.webId),
          sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
          undefined,
          sym(preferences),
        );
      }
    }
  }
}
