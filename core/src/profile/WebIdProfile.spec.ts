import { graph, sym } from "rdflib";
import { WebIdProfile } from "./WebIdProfile";

describe("WebID profile", () => {
  describe("preferences file", () => {
    it("is undefined when nothing in store", () => {
      const profile = new WebIdProfile("https://alice.test#me", graph(), false);
      expect(profile.getPreferencesFile()).toBeUndefined();
    });
    it("is read from preferences file triple in profile document", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/pim/space#preferencesFile"),
        sym("https://alice.test/preferences"),
        sym("https://alice.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPreferencesFile()).toBe(
        "https://alice.test/preferences",
      );
    });

    it("preferences file triple from elsewhere are ignored", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/pim/space#preferencesFile"),
        sym("https://alice.test/preferences"),
        sym("https://evil.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPreferencesFile()).toBeUndefined();
    });
  });
});
