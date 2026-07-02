import { NamedNode, Namespace } from "rdflib";

export const rdfs = Namespace("http://www.w3.org/2000/01/rdf-schema#");
export const pim = Namespace("http://www.w3.org/ns/pim/space#");
export const schema = Namespace("https://schema.org/");
export const flow = Namespace("http://www.w3.org/2005/01/wf/flow#");
export const iana = Namespace(
  "http://www.iana.org/assignments/link-relations/",
);
export const link = Namespace("http://www.w3.org/2007/ont/link#");
export const internal = Namespace("urn:pod-os:internal") as () => NamedNode;
