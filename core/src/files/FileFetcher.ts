import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";
import { LdpContainer } from "../ldp-container";

export class FileFetcher {
  constructor(private session: PodOsSession) {}

  /**
   * Fetch the contents of the given file
   * @param {string} url - URL identifying the file
   * @returns {Promise<SolidFile>} An object representing the fetched file
   */
  async fetchFile(url: string): Promise<SolidFile> {
    const response = await this.session.authenticatedFetch(url);
    if (response.ok) {
      const blob = await response.blob();
      return new BinaryFile(url, blob);
    } else {
      return new BrokenFile(
        url,
        new HttpStatus(response.status, response.statusText),
      );
    }
  }

  /**
   * Updates the contents of a file (overrides old content with the given one)
   * @param file - The file to update
   * @param newContent - The content to put into the file, overriding all existing
   * @returns {Promise<Response>} The HTTP response
   */
  async putFile(file: SolidFile, newContent: string): Promise<Response> {
    return await this.session.authenticatedFetch(file.url, {
      method: "PUT",
      headers: {
        "Content-Type": file.blob()?.type ?? "text/plain",
      },
      body: newContent,
    });
  }

  async createNewFile(container: LdpContainer, name: string) {
    console.log("TODO createNewFile", container, name);
  }

  async createNewFolder(container: LdpContainer, name: string) {
    const encodedName = encodeURIComponent(name);
    await this.session.authenticatedFetch(container.uri + encodedName + "/", {
      method: "PUT",
    });
  }
}
