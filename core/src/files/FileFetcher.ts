import { PodOsSession } from "../authentication";

export class FileFetcher {
  constructor(private session: PodOsSession) {}

  async fetchBlob(url: string): Promise<Blob> {
    return this.session.authenticatedFetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }
      return response.blob();
    });
  }
}
