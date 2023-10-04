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

  describe("private label indexes", () => {
    it("are empty when nothing in store", () => {
      const profile = new WebIdProfile("https://alice.test#me", graph(), false);
      expect(profile.getPrivateLabelIndexes()).toEqual([]);
    });
    it("is read from private label index triple in profile document", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/privateLabelIndex.ttl"),
        sym("https://alice.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateLabelIndexes()).toEqual([
        "https://alice.test/privateLabelIndex.ttl",
      ]);
    });

    it("is read from private label index triple in preferences file", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/pim/space#preferencesFile"),
        sym("https://alice.test/preferences"),
        sym("https://alice.test"),
      );
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/privateLabelIndex.ttl"),
        sym("https://alice.test/preferences"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateLabelIndexes()).toEqual([
        "https://alice.test/privateLabelIndex.ttl",
      ]);
    });

    it("private label index triple from elsewhere are ignored", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/privateLabelIndex.ttl"),
        sym("https://evil.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateLabelIndexes()).toEqual([]);
    });
  });
});
