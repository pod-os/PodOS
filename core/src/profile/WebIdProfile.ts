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
    const profileNodes = this.store.each(
      sym(this.webId),
      sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
      undefined,
      sym(this.webId).doc(),
    );

    const preferences = this.getPreferencesFile();
    if (preferences) {
      const preferencesNodes = this.store.each(
        sym(this.webId),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        undefined,
        sym(preferences),
      );
      return [...profileNodes, ...preferencesNodes].map((it) => it.value);
    } else {
      return profileNodes.map((it) => it.value);
    }
  }
}
