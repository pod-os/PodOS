import { HttpStatus } from "./HttpStatus";
import { SolidFile } from "./SolidFile";

export class BrokenFile implements SolidFile {
  constructor(
    public readonly url: string,
    private readonly status: HttpStatus
  ) {}

  toString() {
    return `${this.url} - ${this.status.toString()}`;
  }

  blob(): Blob {
    throw new Error(`No blob available for ${this.toString()}`);
  }
}
