import { Thing } from "../thing";
import { IndexedFormula, isNamedNode, sym } from "rdflib";

export interface Subject {
  uri: string;
}

export class RdfDocument extends Thing {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    readonly editable: boolean = false,
  ) {
    super(uri, store, editable);
  }

  subjects() {
    const matches = this.store.statementsMatching(
      null,
      null,
      null,
      sym(this.uri),
    );
    const uris = matches
      .filter((match) => isNamedNode(match.subject))
      .map((match) => match.subject.value);
    const uniqueUris = new Set(uris);
    uniqueUris.delete(this.uri);
    return [...uniqueUris].map((uri) => ({
      uri,
    }));
  }
}
