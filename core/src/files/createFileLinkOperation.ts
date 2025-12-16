import { st, sym } from "rdflib";
import { UpdateOperation } from "@solid-data-modules/rdflib-utils";
import { Thing } from "../thing";
import { NewFile } from "../files";

/**
 * Creates an update operation to link a file to a thing.
 * Uses given predicate to establish the relationship.
 *
 * @since 0.24.0
 * @internal
 *
 * @param thing - The thing to link the file to
 * @param predicateUri - The URI of the predicate to use
 * @param file - The uploaded file metadata
 * @returns UpdateOperation that adds the file link to the thing's document
 */
export function createFileLinkOperation(
  thing: Thing,
  predicateUri: string,
  file: NewFile,
): UpdateOperation {
  return {
    deletions: [],
    filesToCreate: [],
    insertions: [
      st(
        sym(thing.uri),
        sym(predicateUri),
        sym(file.url),
        sym(thing.uri).doc(),
      ),
    ],
  };
}
