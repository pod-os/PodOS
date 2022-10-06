export interface SolidFile {
  url: String;
  blob: () => Blob | null;
}
