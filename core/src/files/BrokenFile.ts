import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";

export class BrokenFile implements SolidFile {
  readonly url: string;
  readonly status: HttpStatus;

  constructor(url: string, status: HttpStatus) {
    this.url = url;
    this.status = status;
  }

  toString() {
    return `${this.status.toString()} - ${this.url}`;
  }

  blob(): Blob | null {
    return null;
  }
}
