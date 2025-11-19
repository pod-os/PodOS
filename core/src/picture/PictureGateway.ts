import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { Store } from "../Store";
import { FileFetcher } from "../files/FileFetcher";
import { HttpProblem, NetworkProblem } from "../problems";
import { LdpContainer } from "../ldp-container";

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
   * @returns Result with the picture URL or error
   */
  uploadAndAddPicture(
    thing: Thing,
    pictureFile: File,
  ): ResultAsync<UploadedPicture, HttpProblem | NetworkProblem> {
    const container = this.getContainerFromThing(thing);

    return this.fileFetcher
      .createNewFile(container, pictureFile)
      .map((file) => ({ url: file.url }));
  }

  private getContainerFromThing(thing: Thing): LdpContainer {
    const containerUri = thing.container().uri;
    return this.store.get(containerUri).assume(LdpContainer);
  }
}

export interface UploadedPicture {
  url: string;
}
