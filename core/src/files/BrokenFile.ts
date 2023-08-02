import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";

export class BrokenFile implements SolidFile {
  constructor(
    public readonly url: string,
    public readonly status: HttpStatus,
  ) {}

  toString() {
    return `${this.status.toString()} - ${this.url}`;
  }

  blob(): Blob | null {
    return null;
  }
}
