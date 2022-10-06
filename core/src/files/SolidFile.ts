export interface SolidFile {
  url: string;
  blob: () => Blob | null;
}
