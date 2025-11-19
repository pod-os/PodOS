import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { Store } from "../Store";
import { FileFetcher, NewFile } from "../files";
import { HttpProblem, NetworkProblem } from "../problems";
import { LdpContainer } from "../ldp-container";
import { st, sym } from "rdflib";

export class PictureGateway {
  constructor(
    private readonly store: Store,
    private readonly fileFetcher: FileFetcher,
  ) {}

  /**
   * Uploads a picture file and associates it with a thing.
   * The container is automatically derived from the thing's URI.
   * Uses schema:image as the predicate.
   *
   * @param thing - The thing to add the picture to
   * @param pictureFile - The picture file to upload
   * @returns Result with the uploaded picture metadata (url, name, contentType) or error
   */
  uploadAndAddPicture(
    thing: Thing,
    pictureFile: File,
  ): ResultAsync<UploadedPicture, HttpProblem | NetworkProblem> {
    const container = this.getContainerFromThing(thing);

    return this.fileFetcher
      .createNewFile(container, pictureFile)
      .andThen((file) =>
        ResultAsync.fromPromise(
          this.store
            .executeUpdate({
              deletions: [],
              filesToCreate: [],
              insertions: [
                st(
                  sym(thing.uri),
                  sym("http://schema.org/image"),
                  sym(file.url),
                  sym(thing.uri).doc(),
                ),
              ],
            })
            .then(() => file),
          () => ({ type: "network" as const, title: "Failed to update thing" }),
        ),
      );
  }

  private getContainerFromThing(thing: Thing): LdpContainer {
    return this.store.get(thing.container().uri).assume(LdpContainer);
  }
}

type UploadedPicture = NewFile;
