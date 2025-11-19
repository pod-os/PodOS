import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";
import { LdpContainer } from "../ldp-container";
import {
  HttpProblem,
  httpProblem,
  NetworkProblem,
  networkProblem,
} from "../problems";
import { err, ok, ResultAsync } from "neverthrow";

import mime from "mime/lite";

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

  createNewFile(
    container: LdpContainer,
    name: string | File,
  ): ResultAsync<NewFile, NotCreated> {
    const isFile = name instanceof File;
    const fileName = isFile ? name.name : name;
    const encodedName = encodeURIComponent(fileName);
    const url = container.uri + encodedName;
    const contentTypeHeader = isFile
      ? name.type
      : (mime.getType(encodedName) ?? "text/turtle");
    const body = isFile ? name : undefined;

    return ResultAsync.fromPromise(
      this.session.authenticatedFetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": contentTypeHeader,
          "If-None-Match": "*",
        },
        body,
      }),
      (e) => networkProblem("The file could not be created", e as Error),
    ).andThen((response) =>
      response.ok
        ? ok({
            url,
            name: fileName,
            contentType: contentTypeHeader,
          })
        : err(httpProblem("The file could not be created", response)),
    );
  }

  createNewFolder(
    container: LdpContainer,
    name: string,
  ): ResultAsync<NewFolder, NotCreated> {
    const encodedName = encodeURIComponent(name);
    const url = container.uri + encodedName + "/";
    return ResultAsync.fromPromise(
      this.session.authenticatedFetch(url, {
        method: "PUT",
      }),
      (e) => networkProblem("The folder could not be created", e as Error),
    ).andThen((response) =>
      response.ok
        ? ok({
            url,
            name,
          })
        : err(httpProblem("The folder could not be created", response)),
    );
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

type NotCreated = HttpProblem | NetworkProblem;
