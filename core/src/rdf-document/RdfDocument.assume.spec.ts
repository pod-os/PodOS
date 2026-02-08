import { graph } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "../thing";
import { RdfDocument } from "./RdfDocument";
import { Store } from "../Store";

describe("Thing", () => {
  describe("assuming RdfDocument", () => {
    it("document keeps all properties from generic thing", () => {
      const internalStore = graph();
      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);
      const thing = new Thing("https://thing.example", store, true);
      const document = thing.assume(RdfDocument);
      expect(document.uri).toEqual("https://thing.example");
      expect(document.store).toEqual(store);
      expect(document.editable).toBe(true);
    });
  });
});
