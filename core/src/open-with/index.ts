/**
 * An app that can be used to open a resource
 */
export interface OpenWithApp {
  /**
   * Name of the app
   */
  name: string;
}

export function proposeAppsFor(uri: string, webId: string): OpenWithApp[] {
  return [];
}
