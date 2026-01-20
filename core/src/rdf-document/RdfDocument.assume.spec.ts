import { graph } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "../thing";
import { RdfDocument } from "./RdfDocument";
import { Store } from "../Store";

describe("Thing", () => {
  describe("assuming RdfDocument", () => {
    it("document keeps all properties from generic thing", () => {
      const store = graph();
      const mockSession = {} as unknown as PodOsSession;
      const reactiveStore = new Store(mockSession, undefined, undefined, store);
      const thing = new Thing(
        "https://thing.example",
        store,
        reactiveStore,
        true,
      );
      const document = thing.assume(RdfDocument);
      expect(document.uri).toEqual("https://thing.example");
      expect(document.store).toEqual(store);
      expect(document.editable).toBe(true);
    });
  });
});
