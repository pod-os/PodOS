import { graph } from "rdflib";
import { Thing } from "../thing";
import { RdfDocument } from "./RdfDocument";

describe("Thing", () => {
  describe("assuming RdfDocument", () => {
    it("document keeps all properties from generic thing", () => {
      const store = graph();
      const thing = new Thing("https://thing.example", store, true);
      const document = thing.assume(RdfDocument);
      expect(document.uri).toEqual("https://thing.example");
      expect(document.store).toEqual(store);
      expect(document.editable).toBe(true);
    });
  });
});
