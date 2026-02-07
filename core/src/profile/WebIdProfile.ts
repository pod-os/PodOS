import { IndexedFormula, sym } from "rdflib";
import { Thing } from "../thing";
import { Store } from "../Store";
import {
  PreferencesQuery,
  ProfileQuery,
} from "@solid-data-modules/rdflib-utils";

/**
 * Allows finding things related to the WebID and their profile document
 */
export class WebIdProfile extends Thing {
  private profileQuery: ProfileQuery;
  constructor(
    readonly webId: string,
    readonly store: IndexedFormula,
    readonly reactiveStore: Store,
    readonly editable: boolean = false,
  ) {
    super(webId, store, reactiveStore, editable);
    this.profileQuery = new ProfileQuery(sym(this.webId), this.store);
  }

  /**
   * Returns the URI of the preferences document
   */
  getPreferencesFile() {
    return this.profileQuery.queryPreferencesFile()?.value;
  }

  /**
   * Returns the URI of the public type index document
   * @since 0.24.0
   */
  getPublicTypeIndex() {
    return this.profileQuery.queryPublicTypeIndex()?.value;
  }

  /**
   * Returns the URI of the private type index document
   * @since 0.24.0
   */
  getPrivateTypeIndex() {
    const preferences = this.profileQuery.queryPreferencesFile();
    if (!preferences) return undefined;
    const query = new PreferencesQuery(
      this.store,
      sym(this.webId),
      preferences,
    );
    return query.queryPrivateTypeIndex()?.value;
  }

  /**
   * Returns the URIs of the private label indexes
   */
  getPrivateLabelIndexes(): string[] {
    const profileNodes = this.reactiveStore.each(
      sym(this.webId),
      sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
      undefined,
      sym(this.webId).doc(),
    );

    const preferences = this.getPreferencesFile();
    if (preferences) {
      const preferencesNodes = this.reactiveStore.each(
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
