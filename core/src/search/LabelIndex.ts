import { IndexedFormula, sym } from "rdflib";
import { RdfDocument } from "../rdf-document";
import { rdfs } from "../namespaces";
import { Store } from "../Store";

/**
 * Represents a label index document as described in
 * https://github.com/pod-os/PodOS/blob/main/docs/features/full-text-search.md
 */
export class LabelIndex extends RdfDocument {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly reactiveStore: Store,
    readonly editable: boolean = false,
  ) {
    super(uri, store, reactiveStore, editable);
  }

  /**
   * Returns the URIs and labels for all the things listed in the document.
   */
  getIndexedItems() {
    const matches = this.reactiveStore.statementsMatching(
      null,
      rdfs("label"),
      null,
      sym(this.uri),
    );

    return matches.map((it) => {
      return {
        uri: it.subject.value,
        label: it.object.value,
      };
    });
  }

  contains(uri: string) {
    return this.reactiveStore.holds(
      sym(uri),
      rdfs("label"),
      null,
      sym(this.uri),
    );
  }
}
