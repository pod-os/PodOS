import { IndexedFormula, sym } from "rdflib";
import { RdfDocument } from "../rdf-document";

/**
 * Represents a label index document as described in
 * https://github.com/pod-os/PodOS/blob/main/docs/features/full-text-search.md
 */
export class LabelIndex extends RdfDocument {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(uri, store, editable);
  }

  /**
   * Returns the URIs and labels for all the things listed in the document.
   */
  getIndexedItems() {
    const matches = this.store.statementsMatching(
      null,
      sym("http://www.w3.org/2000/01/rdf-schema#label"),
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
}
