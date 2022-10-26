import { Thing } from "../thing";
import { IndexedFormula, sym } from "rdflib";

export class RdfDocument extends Thing {
  constructor(readonly uri: string, readonly store: IndexedFormula) {
    super(uri, store);
  }

  subjects() {
    const matches = this.store.statementsMatching(
      null,
      null,
      null,
      sym(this.uri)
    );
    const uris = matches.map((match) => match.subject.value);
    const uniqueUris = [...new Set(uris)];
    return uniqueUris.map((uri) => ({
      uri,
    }));
  }
}
