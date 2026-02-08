import { graph } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "../thing";
import { LdpContainer } from "./LdpContainer";
import { Store } from "../Store";

describe("Thing", () => {
  describe("assuming LdpContainer", () => {
    it("container keeps all properties from generic thing", () => {
      const internalStore = graph();
      const mockSession = {} as unknown as PodOsSession;
      const store = new Store(mockSession, undefined, undefined, internalStore);

      const thing = new Thing("https://thing.example", store, true);
      const container = thing.assume(LdpContainer);
      expect(container.uri).toEqual("https://thing.example");
      expect(container.store).toEqual(store);
      expect(container.editable).toBe(true);
    });
  });
});
