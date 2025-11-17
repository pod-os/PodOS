import { graph } from "rdflib";
import { Thing } from "./Thing";

class SpecificThing extends Thing {
  getSpecificInfo() {
    return "specific info";
  }
}

describe("Thing", function () {
  describe("assume", () => {
    it("returns instance of specified subclass", () => {
      const store = graph();
      const thing = new Thing("https://jane.doe.example/resource#it", store);

      const result = thing.assume(SpecificThing);

      expect(result).toBeInstanceOf(SpecificThing);
      expect(result.getSpecificInfo()).toBe("specific info");
    });

    it("preserves uri when assuming subclass", () => {
      const store = graph();
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        true,
      );

      const result = thing.assume(SpecificThing);

      expect(result.uri).toBe("https://jane.doe.example/resource#it");
    });

    it("preserves store when assuming subclass", () => {
      const store = graph();
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        true,
      );

      const result = thing.assume(SpecificThing);

      expect(result.store).toBe(store);
    });

    it("preserves editable property when assuming subclass", () => {
      const store = graph();
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        true,
      );

      const result = thing.assume(SpecificThing);

      expect(result.editable).toBe(true);
    });
  });
});
