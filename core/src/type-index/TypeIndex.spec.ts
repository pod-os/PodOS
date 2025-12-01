import { graph, quad, sym } from "rdflib";
import { TypeIndex } from "./TypeIndex";
import { solid } from "@solid-data-modules/rdflib-utils";
import { schema } from "../namespaces";

describe("TypeIndex", () => {
  describe("listAll", () => {
    it("returns empty list if nothing is in store", () => {
      // Given: a type index with an empty store
      const emptyStore = graph();
      const typeIndex = new TypeIndex(
        "https://pod.test/type-index.ttl",
        emptyStore,
      );

      // When: calling listAll
      const registrations = typeIndex.listAll();

      // Then: an empty array is returned
      expect(registrations).toEqual([]);
    });

    it("returns a single registration for an instance container", () => {
      // Given a type index with one registration for an instance container
      const store = graph();
      const typeIndexUri = "https://pod.test/settings/typeIndex.ttl";
      const registrationUri = `${typeIndexUri}#VideoGames`;

      store.add(
        quad(sym(registrationUri), solid("forClass"), schema("VideoGame")),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instanceContainer"),
          sym("https://pod.test/games/"),
        ),
      );

      const typeIndex = new TypeIndex(typeIndexUri, store);

      // When listing all entries
      const registrations = typeIndex.listAll();

      // Then one registration is returned with correct properties
      expect(registrations).toHaveLength(1);
      expect(registrations[0]).toEqual({
        type: "container",
        targetUri: "https://pod.test/games/",
        forClass: "https://schema.org/VideoGame",
      });
    });
  });
});
