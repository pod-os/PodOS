/**
 * Represents a term from a RDF vocabulary
 */
export interface Term {
  /**
   * Full URI of the term, e.g. http://xmlns.com/foaf/0.1/name
   */
  uri: string;
  /**
   * Shorthand syntax of the term, using a well-known prefix, e.g. foaf:name
   */
  shorthand: string;
}
