/**
 * An app that can be used to open a resource
 */
export interface OpenWithApp {
  /**
   * Name of the app
   */
  name: string;
  /**
   * Base URL of the app
   */
  appUrl: string;
  /**
   * Query parameter used to identify the URI in the target application
   */
  uriParam: string;
}

export function proposeAppsFor(uri: string, webId: string): OpenWithApp[] {
  return [
    {
      name: "Data Browser (SolidOS)",
      appUrl: "https://solidos.github.io/mashlib/dist/browse.html",
      uriParam: "uri",
    },
    {
      name: "Penny",
      appUrl: "https://penny.vincenttunru.com/explore/",
      uriParam: "url",
    },
    {
      name: "Solid File Manager",
      appUrl: "https://otto-aa.github.io/solid-filemanager/",
      uriParam: "url",
    },
  ];
}
