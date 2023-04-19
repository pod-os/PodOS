import { Store } from "../Store";
import slugify from "slugify";

export class UriService {
  // We expect to use the store for calculating the uris for things
  // e.g. looking up locations in type index
  constructor(private readonly store: Store) {}

  /**
   * Proposes a URI for a new thing based on what the referenceUri identifies:
   * - if a container, the new URI is in this container
   * - if a file, the new URI is in the same container as said file
   * - if a non-information-resource, the new URI is in the same container as that resource
   * @param referenceUri
   * @param name (will be slugified)
   */
  proposeUriForNewThing(referenceUri: string, name: string) {
    const filename = slugify(name, { lower: true });
    return `${new URL(filename, referenceUri)}#it`;
  }
}
