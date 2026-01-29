import { graph } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "../thing";
import { LdpContainer } from "./LdpContainer";
import { Store } from "../Store";

describe("Thing", () => {
  describe("assuming LdpContainer", () => {
    it("container keeps all properties from generic thing", () => {
      const store = graph();
      const mockSession = {} as unknown as PodOsSession;
      const reactiveStore = new Store(mockSession, undefined, undefined, store);

      const thing = new Thing(
        "https://thing.example",
        store,
        reactiveStore,
        true,
      );
      const container = thing.assume(LdpContainer);
      expect(container.uri).toEqual("https://thing.example");
      expect(container.store).toEqual(store);
      expect(container.editable).toBe(true);
    });
  });
});
