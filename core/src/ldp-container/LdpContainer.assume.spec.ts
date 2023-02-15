import { graph } from "rdflib";
import { Thing } from "../thing";
import { LdpContainer } from "./LdpContainer";

describe("Thing", () => {
  describe("assuming LdpContainer", () => {
    it("container keeps all properties from generic thing", () => {
      const store = graph();
      const thing = new Thing("https://thing.example", store, true);
      const container = thing.assume(LdpContainer);
      expect(container.uri).toEqual("https://thing.example");
      expect(container.store).toEqual(store);
      expect(container.editable).toBe(true);
    });
  });
});
