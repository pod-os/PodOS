import { Thing } from "../thing";
import { IndexedFormula, sym } from "rdflib";

export class RdfDocument extends Thing {
  constructor(readonly uri: string, readonly store: IndexedFormula) {
    super(uri, store);
  }

  subjects() {
    const matches = this.store.anyStatementMatching(
      null,
      null,
      null,
      sym(this.uri)
    );
    return matches ? [{ uri: matches?.subject.value }] : [];
  }
}
