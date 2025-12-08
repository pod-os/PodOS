import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { FileGateway, NewFile } from "../files";
import { HttpProblem, NetworkProblem } from "../problems";

/**
 * Gateway for picture-related operations on Solid Pods and the store.
 */
export class PictureGateway {
  constructor(private readonly attachmentGateway: FileGateway) {}

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
    return this.attachmentGateway.uploadAndLinkFile(
      thing,
      "http://schema.org/image",
      pictureFile,
    );
  }
}

type UploadedPicture = NewFile;
