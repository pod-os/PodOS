import { isBlankNode, isLiteral, isNamedNode, sym } from "rdflib";
import { flow } from "../namespaces";
import { accumulateSubjects } from "./accumulateSubjects";
import { accumulateValues } from "./accumulateValues";
import { isRdfType } from "./isRdfType";
import { labelForType } from "./labelForType";
import { labelFromUri } from "./labelFromUri";
import { Store } from "../Store";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  merge,
  Observable,
  startWith,
} from "rxjs";

export interface Literal {
  predicate: string;
  label: string;
  values: string[];
}

export interface Relation {
  predicate: string;
  label: string;
  uris: string[];
}

export interface RdfType {
  uri: string;
  label: string;
}

export interface Attachment {
  uri: string;
  label: string;
}

export class Thing {
  constructor(
    readonly uri: string,
    readonly store: Store,
    /**
     * Whether the Thing can be edited according to its access control settings
     */
    readonly editable: boolean = false,
  ) {}

  /**
   * Returns a human-readable label for this thing. Tries to match common RDF terms
   * used for labels, such as `rdfs:label`, `schema:name` and others.
   *
   * If no such term is present, it will derive a label from the URI.
   */
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
    if (value) {
      return value;
    }
    return labelFromUri(this.uri);
  }

  /**
   * Returns all the literal values that are linked to this thing
   */
  literals(): Literal[] {
    const statements = this.store.statementsMatching(sym(this.uri));

    const values = statements
      .filter((it) => isLiteral(it.object))
      .reduce(accumulateValues, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      label: labelFromUri(predicate),
      values: values[predicate],
    }));
  }

  /**
   * Returns all the links from this thing to other resources
   */
  relations(predicate?: string): Relation[] {
    const statements = this.store.statementsMatching(
      sym(this.uri),
      predicate ? sym(predicate) : null,
    );

    const values = statements
      .filter((it) => isNamedNode(it.object) && !isRdfType(it.predicate))
      .reduce(accumulateValues, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      label: labelFromUri(predicate),
      uris: values[predicate],
    }));
  }

  /**
   * Observe changes in links from this thing to other resources
   */
  observeRelations(predicate?: string): Observable<Relation[]> {
    return merge(this.store.additions$, this.store.removals$).pipe(
      // Note: we assume that cost of filtering by the optional predicate is not worthwhile
      filter((quad) => quad.subject.value == this.uri),
      debounceTime(250),
      map(() => this.relations(predicate)),
      // Note: will not trigger an update if label changes, as label is currently constructed from predicate
      distinctUntilChanged((prev, curr) =>
        prev.every(
          (rel, i) =>
            rel.predicate == curr[i].predicate &&
            rel.uris.length == curr[i].uris.length,
        ),
      ),
      startWith(this.relations(predicate)),
    );
  }

  /**
   * Returns all the links from other resources to this thing
   */
  reverseRelations(predicate?: string): Relation[] {
    const statements = this.store.statementsMatching(
      undefined,
      predicate ? sym(predicate) : null,
      sym(this.uri),
    );

    const values = statements.reduce(accumulateSubjects, {});

    return Object.keys(values).map((predicate) => ({
      predicate,
      label: labelFromUri(predicate),
      uris: values[predicate],
    }));
  }

  /**
   * Observe changes in links from other resources to this thing
   */
  observeReverseRelations(predicate?: string): Observable<Relation[]> {
    return merge(this.store.additions$, this.store.removals$).pipe(
      // Note: we assume that cost of filtering by the optional predicate is not worthwhile
      filter((quad) => quad.object.value == this.uri),
      debounceTime(250),
      map(() => this.reverseRelations(predicate)),
      // Note: will not trigger an update if label changes, as label is currently constructed from predicate
      distinctUntilChanged((prev, curr) =>
        prev.every(
          (rel, i) =>
            rel.predicate == curr[i].predicate &&
            rel.uris.length == curr[i].uris.length,
        ),
      ),
      startWith(this.reverseRelations(predicate)),
    );
  }

  /**
   * Returns any value linked from this thing via one of the given predicates
   * @param predicateUris
   */
  anyValue(...predicateUris: string[]) {
    let value;
    predicateUris.some((it) => {
      value = this.store.anyValue(sym(this.uri), sym(it));
      return Boolean(value);
    });
    return value;
  }

  /**
   * Returns a literal value that describes this thing. Tries to match common RDF terms
   * used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`
   */
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

  /**
   * Returns the url of a picture or logo associated with this thing
   * Tries to match common RDF terms used for pictures like `schema:image`,
   * `vcard:photo` or `foaf:img`
   *
   * @return {Object} An object containing the `url` of the picture
   */
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

  /**
   * Retrieves a list of RDF types for this thing.
   */
  types(): RdfType[] {
    const uris = this.store.findTypes(this.uri);
    return uris.map((uri) => ({
      uri,
      label: labelForType(uri),
    }));
  }

  /**
   * Observe changes to the list of RDF types for this thing
   */
  observeTypes(): Observable<RdfType[]> {
    return merge(this.store.additions$, this.store.removals$).pipe(
      filter(
        (quad) =>
          (quad.subject.value == this.uri &&
            quad.predicate.value ==
              "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") ||
          quad.predicate.value ==
            "http://www.w3.org/2000/01/rdf-schema#subClassOf",
      ),
      map(() => this.types()),
      startWith(this.types()),
      distinctUntilChanged((prev, curr) => prev.length == curr.length),
    );
  }

  /**
   * Returns all attachments linked to this thing
   */
  attachments(): Attachment[] {
    const statements = this.store.statementsMatching(
      sym(this.uri),
      flow("attachment"),
    );

    return statements
      .filter((it) => isNamedNode(it.object))
      .map((statement) => ({
        uri: statement.object.value,
        label: labelFromUri(statement.object.value),
      }));
  }

  /**
   * Call this method to switch to a more specific subclass of Thing.
   *
   * @param SpecificThing - a subclass of Thing to assume
   */
  assume<T>(
    SpecificThing: new (uri: string, store: Store, editable: boolean) => T,
  ) {
    return new SpecificThing(this.uri, this.store, this.editable);
  }

  /**
   * Returns the container that contains this thing's document
   * The container URI is derived from the thing's URI.
   */
  container(): { uri: string } {
    const doc = sym(this.uri).doc();
    const baseUri = doc.value.endsWith("/")
      ? doc.value.slice(0, -1)
      : doc.value;
    const uri = new URL(".", baseUri).toString();
    return { uri };
  }
}
