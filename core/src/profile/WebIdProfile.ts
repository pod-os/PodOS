import { IndexedFormula, sym } from "rdflib";
import { Thing } from "../thing";

/**
 * Allows to find things related to the WebID and their profile document
 */
export class WebIdProfile extends Thing {
  constructor(
    readonly webId: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(webId, store, editable);
  }

  /**
   * Returns te URI of the preferences document
   */
  getPreferencesFile() {
    return this.store.anyValue(
      sym(this.webId),
      sym("http://www.w3.org/ns/pim/space#preferencesFile"),
      undefined,
      sym(this.webId).doc(),
    );
  }

  /**
   * Returns the URIs of the private label indexes
   */
  getPrivateLabelIndexes(): string[] {
    const index = this.store.anyValue(
      sym(this.webId),
      sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
      undefined,
      sym(this.webId).doc(),
    );
    if (index) {
      return [index];
    } else {
      const preferences = this.getPreferencesFile();
      if (preferences) {
        const value = this.store.anyValue(
          sym(this.webId),
          sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
          undefined,
          sym(preferences),
        );
        return value ? [value] : [];
      } else {
        return [];
      }
    }
  }
}
