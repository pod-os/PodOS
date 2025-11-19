import { st, sym } from "rdflib";
import { UpdateOperation } from "@solid-data-modules/rdflib-utils";
import { Thing } from "../thing";
import { NewFile } from "../files";

const SCHEMA_IMAGE = "http://schema.org/image";

/**
 * Creates an update operation to link a picture file to a thing.
 * Uses schema:image as the predicate to establish the relationship.
 *
 * @param thing - The thing to link the picture to
 * @param file - The uploaded picture file metadata
 * @returns UpdateOperation that adds the picture link to the thing's document
 */
export function createPictureLinkOperation(
  thing: Thing,
  file: NewFile,
): UpdateOperation {
  return {
    deletions: [],
    filesToCreate: [],
    insertions: [
      st(
        sym(thing.uri),
        sym(SCHEMA_IMAGE),
        sym(file.url),
        sym(thing.uri).doc(),
      ),
    ],
  };
}
