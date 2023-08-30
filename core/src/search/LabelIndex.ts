import { IndexedFormula, sym } from "rdflib";
import { RdfDocument } from "../rdf-document";
import { Thing } from "../thing";

export class LabelIndex extends RdfDocument {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(uri, store, editable);
  }

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
