import { IndexedFormula, isLiteral, isNamedNode, Statement, sym } from "rdflib";

export class Thing {
  constructor(readonly uri: string, readonly store: IndexedFormula) {}

  label() {
    const value =
      this.store.anyValue(
        sym(this.uri),
        sym("http://xmlns.com/foaf/0.1/name")
      ) ??
      this.store.anyValue(
        sym(this.uri),
        sym("http://xmlns.com/foaf/0.1/nick")
      ) ??
      this.store.anyValue(sym(this.uri), sym("https://schema.org/name")) ??
      this.store.anyValue(sym(this.uri), sym("http://schema.org/name")) ??
      this.store.anyValue(
        sym(this.uri),
        sym("http://purl.org/dc/terms/title")
      ) ??
      this.store.anyValue(
        sym(this.uri),
        sym("http://purl.org/dc/elements/1.1/title")
      ) ??
      this.store.anyValue(
        sym(this.uri),
        sym("http://www.w3.org/2000/01/rdf-schema#label")
      ) ??
      this.store.anyValue(
        sym(this.uri),
        sym("https://www.w3.org/ns/activitystreams#name")
      ) ??
      this.store.anyValue(
        sym(this.uri),
        sym("http://www.w3.org/2006/vcard/ns#fn")
      ) ??
      this.store.anyValue(sym(this.uri), sym("http://schema.org/caption")) ??
      this.store.anyValue(sym(this.uri), sym("https://schema.org/caption"));
    return value ?? this.uri;
  }

  literals() {
    const statements = this.store.statementsMatching(sym(this.uri));

    const values = statements
      .filter((it) => isLiteral(it.object))
      .reduce((accumulator: Accumulator, current: Statement) => {
        const existing = accumulator[current.predicate.uri];
        return {
          ...accumulator,
          [current.predicate.uri]: existing
            ? [...existing, current.object.value]
            : [current.object.value],
        };
      }, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      values: values[predicate],
    }));
  }

  relations() {
    const statements = this.store.statementsMatching(sym(this.uri));

    const values = statements
      .filter((it) => isNamedNode(it.object))
      .reduce((accumulator: Accumulator, current: Statement) => {
        const existing = accumulator[current.predicate.uri];
        return {
          ...accumulator,
          [current.predicate.uri]: existing
            ? [...existing, current.object.value]
            : [current.object.value],
        };
      }, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      uris: values[predicate],
    }));
  }
}

interface Accumulator {
  [key: string]: string[];
}
