import {
  IndexedFormula,
  isBlankNode,
  isLiteral,
  isNamedNode,
  sym,
} from "rdflib";
import { accumulateSubjects } from "./accumulateSubjects";
import { accumulateValues } from "./accumulateValues";
import { isRdfType } from "./isRdfType";
import { labelForType } from "./labelForType";

export interface Literal {
  predicate: string;
  values: string[];
}

export interface Relation {
  predicate: string;
  uris: string[];
}

export interface RdfType {
  uri: string;
  label: string;
}

export class Thing {
  constructor(
    readonly uri: string,
    readonly store: IndexedFormula,
    /**
     * Whether the Thing can be edited according to its access control settings
     */
    readonly editable: boolean = false,
  ) {}

  label() {
    const value = this.anyValue(
      "http://www.w3.org/2006/vcard/ns#fn",
      "http://xmlns.com/foaf/0.1/name",
      "http://xmlns.com/foaf/0.1/nick",
      "https://schema.org/name",
      "http://schema.org/name",
      "http://purl.org/dc/terms/title",
      "http://purl.org/dc/elements/1.1/title",
      "http://www.w3.org/2000/01/rdf-schema#label",
      "https://www.w3.org/ns/activitystreams#name",
      "http://schema.org/caption",
      "https://schema.org/caption",
    );
    return value ?? this.uri;
  }

  literals(): Literal[] {
    const statements = this.store.statementsMatching(sym(this.uri));

    const values = statements
      .filter((it) => isLiteral(it.object))
      .reduce(accumulateValues, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      values: values[predicate],
    }));
  }

  relations(): Relation[] {
    const statements = this.store.statementsMatching(sym(this.uri));

    const values = statements
      .filter((it) => isNamedNode(it.object) && !isRdfType(it.predicate))
      .reduce(accumulateValues, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      uris: values[predicate],
    }));
  }

  reverseRelations(): Relation[] {
    const statements = this.store.statementsMatching(
      undefined,
      undefined,
      sym(this.uri),
    );

    const values = statements.reduce(accumulateSubjects, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      uris: values[predicate],
    }));
  }

  anyValue(...predicateUris: string[]) {
    let value;
    predicateUris.some((it) => {
      value = this.store.anyValue(sym(this.uri), sym(it));
      return Boolean(value);
    });
    return value;
  }

  description() {
    return this.anyValue(
      "http://purl.org/dc/terms/description",
      "http://purl.org/dc/elements/1.1/description",
      "http://schema.org/description",
      "https://schema.org/description",
      "https://schema.org/text",
      "http://www.w3.org/2000/01/rdf-schema#comment",
      "https://www.w3.org/ns/activitystreams#summary",
      "https://www.w3.org/ns/activitystreams#content",
      "http://www.w3.org/2006/vcard/ns#note",
    );
  }

  picture() {
    const directUrl = this.anyValue(
      "http://schema.org/image",
      "https://schema.org/image",
      "http://schema.org/logo",
      "https://schema.org/logo",
      "http://www.w3.org/2006/vcard/ns#hasPhoto",
      "http://www.w3.org/2006/vcard/ns#photo",
      "http://www.w3.org/2006/vcard/ns#hasLogo",
      "http://www.w3.org/2006/vcard/ns#logo",
      "http://xmlns.com/foaf/0.1/img",
      "http://xmlns.com/foaf/0.1/depiction",
      "http://xmlns.com/foaf/0.1/thumbnail",
    );
    if (directUrl) {
      return {
        url: directUrl,
      };
    } else {
      return this.findActivityStreamsPicture();
    }
  }

  private findActivityStreamsPicture() {
    const activityStreamsImage =
      this.store.any(
        sym(this.uri),
        sym("https://www.w3.org/ns/activitystreams#image"),
      ) ||
      this.store.any(
        sym(this.uri),
        sym("https://www.w3.org/ns/activitystreams#icon"),
      );
    if (
      !activityStreamsImage ||
      !(isBlankNode(activityStreamsImage) || isNamedNode(activityStreamsImage))
    ) {
      return null;
    }
    const url = this.store.anyValue(
      activityStreamsImage,
      sym("https://www.w3.org/ns/activitystreams#url"),
    );
    return url
      ? {
          url,
        }
      : null;
  }

  types(): RdfType[] {
    const uriMap = this.store.findTypeURIs(sym(this.uri));
    return Object.keys(uriMap).map((uri) => ({
      uri,
      label: labelForType(uri),
    }));
  }

  assume<T>(
    SpecificThing: new (
      uri: string,
      store: IndexedFormula,
      editable: boolean,
    ) => T,
  ) {
    return new SpecificThing(this.uri, this.store, this.editable);
  }
}
