import { SolidFile } from "./SolidFile";

export class BinaryFile implements SolidFile {
  constructor(
    public readonly url: string,
    private readonly data: Blob,
  ) {}

  blob(): Blob {
    return this.data;
  }
}
