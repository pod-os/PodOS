// Import the original types from rdflib
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as rdflib from "rdflib";
import { AutoInitOptions } from "rdflib";

/**
 * This module declaration is needed as a workarround, because
 * rdflib does not export all the types used in the method signatures of the Fetcher.
 * We are changing the signatures here to something that is available and (hopefully) matches with
 * what the Fetcher is actually compatible with
 */
declare module "rdflib" {
  export class Fetcher {
    constructor(store: IndexedFormula, options?: Partial<AutoInitOptions>);

    async load<T extends NamedNode | string | Array<string | NamedNode>>(
      url: T,
      options?: object,
    ): Promise<Response>;
  }
}
