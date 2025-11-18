import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { Store } from "../Store";
import { FileFetcher } from "../files/FileFetcher";
import { HttpProblem, NetworkProblem } from "../problems";

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
    throw new Error("Not implemented");
  }
}

export interface UploadedPicture {
  url: string;
}
