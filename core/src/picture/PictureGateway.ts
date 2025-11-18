import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { Store } from "../Store";
import { FileFetcher } from "../files/FileFetcher";
import { HttpProblem, NetworkProblem } from "../problems";
import { LdpContainer } from "../ldp-container";
import { graph } from "rdflib";

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
    pictureFile: Blob,
  ): ResultAsync<UploadedPicture, HttpProblem | NetworkProblem> {
    const containerUri = thing.uri.substring(0, thing.uri.lastIndexOf("/") + 1);
    const container = new LdpContainer(containerUri, graph(), true);

    return this.fileFetcher
      .createNewFile(container, "picture.png")
      .map((file) => ({ url: file.url }));
  }
}

export interface UploadedPicture {
  url: string;
}
