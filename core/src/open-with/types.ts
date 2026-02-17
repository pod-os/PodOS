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
