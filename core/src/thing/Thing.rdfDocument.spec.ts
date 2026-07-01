import { beforeEach, describe, expect, it } from "vitest";
import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";
import { rdf } from "@solid-data-modules/rdflib-utils";
import { iana, internal, link } from "../namespaces";

describe("Thing", function () {
  let internalStore: IndexedFormula;
  const mockSession = {} as unknown as PodOsSession;
  let store: Store;

  beforeEach(() => {
    internalStore = graph();
    store = new Store(mockSession, undefined, undefined, internalStore);
  });

  describe("rdf document", () => {
    it("returns nothing if store is empty", () => {
      const thing = new Thing("https://resource.test#it", store, false);
      const result = thing.rdfDocument();
      expect(result).toBeUndefined();
    });

    it("returns the document corresponding to URI, if it is an RDF document", () => {
      const doc = sym("https://resource.test");
      internalStore.add(doc, rdf("type"), link("RDFDocument"), doc);
      const thing = new Thing("https://resource.test#it", store, false);
      const result = thing.rdfDocument();
      expect(result).toBeDefined();
      expect(result).toEqual(doc.value);
    });

    it("returns the description document if the default document is non-RDF", () => {
      const doc = sym("https://resource.test");
      internalStore.add(
        doc,
        rdf("type"),
        sym("https://vocab.test/NonRdfDocument"),
        doc,
      );
      const meta = sym("https://resource.test.meta");
      internalStore.add(doc, iana("describedby"), meta, internal());
      const thing = new Thing("https://resource.test#it", store, false);
      const result = thing.rdfDocument();
      expect(result).toBeDefined();
      expect(result).toEqual(meta.value);
    });
  });
});
