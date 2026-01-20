import { graph, IndexedFormula } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

class SpecificThing extends Thing {
  getSpecificInfo() {
    return "specific info";
  }
}

describe("Thing", function () {
  describe("assume", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("returns instance of specified subclass", () => {
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
      );

      const result = thing.assume(SpecificThing);

      expect(result).toBeInstanceOf(SpecificThing);
      expect(result.getSpecificInfo()).toBe("specific info");
    });

    it("preserves uri when assuming subclass", () => {
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
        true,
      );

      const result = thing.assume(SpecificThing);

      expect(result.uri).toBe("https://jane.doe.example/resource#it");
    });

    it("preserves store when assuming subclass", () => {
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
        true,
      );

      const result = thing.assume(SpecificThing);

      expect(result.store).toBe(store);
    });

    it("preserves editable property when assuming subclass", () => {
      const thing = new Thing(
        "https://jane.doe.example/resource#it",
        store,
        reactiveStore,
        true,
      );

      const result = thing.assume(SpecificThing);

      expect(result.editable).toBe(true);
    });
  });
});
