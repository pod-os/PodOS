import { Template } from "url-template";

/**
 * An app that can be used to open a resource
 */
export interface OpenWithApp {
  /**
   * Name of the app
   */
  name: string;
  /**
   * RFC 6570 template for the URL to open the resource with the app
   */
  urlTemplate: Template;
}
