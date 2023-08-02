import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";

export class FileFetcher {
  constructor(private session: PodOsSession) {}

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
}
