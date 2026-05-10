import { SolidFile } from "./SolidFile";

export class BinaryFile implements SolidFile {
  readonly url: string;
  private readonly data: Blob;

  constructor(url: string, data: Blob) {
    this.url = url;
    this.data = data;
  }

  blob(): Blob {
    return this.data;
  }
}
