import { ResultAsync } from "neverthrow";
import { Thing } from "../thing";
import { Store } from "../Store";
import { FileFetcher, NewFile } from "../files";
import { HttpProblem, NetworkProblem } from "../problems";
import { LdpContainer } from "../ldp-container";
import { createFileLinkOperation } from "./createFileLinkOperation";

/**
 * Gateway for file-related operations on Solid Pods and the store.
 * @since 0.24.0
 */
export class FileGateway {
  constructor(
    private readonly store: Store,
    private readonly fileFetcher: FileFetcher,
  ) {}

  /**
   * Uploads a file and associates it with a thing.
   * The container is automatically derived from the thing's URI.
   * Uses schema:image as the predicate.
   *
   * @param thing - The thing to add the file to
   * @param predicateUri - The URI of the predicate to use
   * @param fileToUpload - The file to upload
   * @returns Result with the uploaded metadata (url, name, contentType) or error
   */
  uploadAndLinkFile(
    thing: Thing,
    predicateUri: string,
    fileToUpload: File,
  ): ResultAsync<NewFile, HttpProblem | NetworkProblem> {
    const container = this.getContainerFromThing(thing);

    return this.fileFetcher
      .createNewFile(container, fileToUpload)
      .andThen((file) => this.linkFileToThing(thing, predicateUri, file));
  }

  private linkFileToThing(
    thing: Thing,
    predicateUri: string,
    file: NewFile,
  ): ResultAsync<NewFile, NetworkProblem> {
    const operation = createFileLinkOperation(thing, predicateUri, file);

    return ResultAsync.fromPromise(
      this.store.executeUpdate(operation).then(() => file),
      () => ({
        type: "network" as const,
        title: "Failed to link file to thing",
      }),
    );
  }

  private getContainerFromThing(thing: Thing): LdpContainer {
    return this.store.get(thing.container().uri).assume(LdpContainer);
  }
}
