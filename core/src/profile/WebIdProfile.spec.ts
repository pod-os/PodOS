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

    it("reads multiple private label index triples in profile document", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/privateLabelIndex.ttl"),
        sym("https://alice.test"),
      );
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/secondPrivateLabelIndex.ttl"),
        sym("https://alice.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateLabelIndexes()).toEqual([
        "https://alice.test/privateLabelIndex.ttl",
        "https://alice.test/secondPrivateLabelIndex.ttl",
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

    it("reads multiple private label index triples in preferences file", () => {
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
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/secondPrivateLabelIndex.ttl"),
        sym("https://alice.test/preferences"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateLabelIndexes()).toEqual([
        "https://alice.test/privateLabelIndex.ttl",
        "https://alice.test/secondPrivateLabelIndex.ttl",
      ]);
    });

    it("reads both private label indexes from profile and preferences file", () => {
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
        sym("https://alice.test/preferencesPrivateLabelIndex.ttl"),
        sym("https://alice.test/preferences"),
      );
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#privateLabelIndex"),
        sym("https://alice.test/profilePrivateLabelIndex.ttl"),
        sym("https://alice.test"),
      );

      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateLabelIndexes()).toEqual([
        "https://alice.test/profilePrivateLabelIndex.ttl",
        "https://alice.test/preferencesPrivateLabelIndex.ttl",
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

  describe("public type index", () => {
    it("is undefined when nothing in store", () => {
      const profile = new WebIdProfile("https://alice.test#me", graph(), false);
      expect(profile.getPublicTypeIndex()).toBeUndefined();
    });
    it("is read from publicTypeIndex triple in profile document", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/solid/terms#publicTypeIndex"),
        sym("https://alice.test/publicTypeIndex"),
        sym("https://alice.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPublicTypeIndex()).toBe(
        "https://alice.test/publicTypeIndex",
      );
    });
  });

  describe("private type index", () => {
    it("is undefined when nothing in store", () => {
      const profile = new WebIdProfile("https://alice.test#me", graph(), false);
      expect(profile.getPrivateTypeIndex()).toBeUndefined();
    });
    it("is undefined when nothing in preferences document", () => {
      const profile = new WebIdProfile("https://alice.test#me", graph(), false);
      expect(profile.getPrivateTypeIndex()).toBeUndefined();
    });
    it("is read from privateType triple in preferences document", () => {
      const store = graph();
      store.add(
        sym("https://alice.test#me"),
        sym("http://www.w3.org/ns/pim/space#preferencesFile"),
        sym("https://alice.test/preferences"),
        sym("https://alice.test"),
      );
      const profile = new WebIdProfile("https://alice.test#me", store, false);
      expect(profile.getPrivateTypeIndex()).toBe(undefined);
    });
  });
});
