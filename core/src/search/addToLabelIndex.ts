import { UpdateOperation } from "@solid-data-modules/rdflib-utils";
import { LabelIndex } from "./LabelIndex";
import { lit, st, sym } from "rdflib";
import { rdfs } from "../namespaces";
import { Thing } from "../thing";

export const addToLabelIndex = (
  thing: Thing,
  labelIndex: LabelIndex,
): UpdateOperation => {
  return {
    deletions: [],
    filesToCreate: [],
    insertions: [
      st(
        sym(thing.uri),
        rdfs("label"),
        lit(thing.label()),
        sym(labelIndex.uri),
      ),
    ],
  };
};
