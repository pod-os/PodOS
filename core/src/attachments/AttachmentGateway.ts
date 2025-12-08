import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { FileGateway, NewFile } from "../files";
import { HttpProblem, NetworkProblem } from "../problems";

/**
 * Gateway for attachment-related operations on Solid Pods and the store.
 */
export class AttachmentGateway {
  constructor(private readonly fileGateway: FileGateway) {}

  /**
   * Uploads an attachment file and associates it with a thing.
   * The container is automatically derived from the thing's URI.
   * Uses flow:attachment as the predicate.
   *
   * @param thing - The thing to add the attachment to
   * @param attachmentFile - The attachment file to upload
   * @returns Result with the uploaded attachment metadata (url, name, contentType) or error
   */
  uploadAndAddAttachment(
    thing: Thing,
    attachmentFile: File,
  ): ResultAsync<UploadedAttachment, HttpProblem | NetworkProblem> {
    return this.fileGateway.uploadAndLinkFile(
      thing,
      "http://www.w3.org/2005/01/wf/flow#attachment",
      attachmentFile,
    );
  }
}

type UploadedAttachment = NewFile;
