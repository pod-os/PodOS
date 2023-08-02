import { sym } from "rdflib";
import { PredicateType } from "rdflib/lib/types";

export function isRdfType(predicate: PredicateType): boolean {
  return predicate.sameTerm(
    sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
  );
}
