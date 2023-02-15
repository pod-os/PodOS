import * as terms from "rdf-namespaces";
import { createListOfTerms } from "./createListOfTerms";
import { Term } from "./Term";

/**
 * Returns a list of terms from commonly used and well-known RDF vocabularies
 */
export function listKnownTerms(): Term[] {
  return createListOfTerms(terms);
}
