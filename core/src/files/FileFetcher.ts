import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";
import { LdpContainer } from "../ldp-container";
import Result = lunr.Index.Result;

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

  async createNewFile(container: LdpContainer, name: string): Promise<NewFile> {
    const encodedName = encodeURIComponent(name);
    const url = container.uri + encodedName;
    const contentType = "text/turtle"; // TODO determine content type
    const response = await this.session.authenticatedFetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "If-None-Match": "*",
      },
    });
    if (!response.ok) {
      throw response;
    }
    return {
      url,
      name,
      contentType: contentType,
    };
  }

  async createNewFolder(
    container: LdpContainer,
    name: string,
  ): Promise<NewFolder> {
    const encodedName = encodeURIComponent(name);
    const url = container.uri + encodedName + "/";
    await this.session.authenticatedFetch(url, {
      method: "PUT",
    });
    return {
      url,
      name,
    };
  }
}

interface NewFolder {
  url: string;
  name: string;
}

interface NewFile {
  url: string;
  name: string;
  contentType: string;
}
