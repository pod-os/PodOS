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
        quad(
          sym(registrationUri),
          solid("forClass"),
          schema("VideoGame"),
          sym(typeIndexUri),
        ),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instanceContainer"),
          sym("https://pod.test/games/"),
          sym(typeIndexUri),
        ),
      );

      const typeIndex = new TypeIndex(typeIndexUri, store);

      // When listing all entries
      const registrations = typeIndex.listAll();

      // Then one registration is returned with correct properties
      expect(registrations).toHaveLength(1);
      expect(registrations[0]).toEqual({
        forClass: "https://schema.org/VideoGame",
        targets: [
          {
            type: "container",
            uri: "https://pod.test/games/",
          },
        ],
      });
    });

    it("returns a single registration with multiple instance containers", () => {
      // Given a type index with one registration for several instance containers
      const store = graph();
      const typeIndexUri = "https://pod.test/settings/typeIndex.ttl";
      const registrationUri = `${typeIndexUri}#VideoGames`;

      store.add(
        quad(
          sym(registrationUri),
          solid("forClass"),
          schema("VideoGame"),
          sym(typeIndexUri),
        ),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instanceContainer"),
          sym("https://pod.test/games/"),
          sym(typeIndexUri),
        ),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instanceContainer"),
          sym("https://pod.test/more-games/"),
          sym(typeIndexUri),
        ),
      );

      const typeIndex = new TypeIndex(typeIndexUri, store);

      // When listing all entries
      const registrations = typeIndex.listAll();

      // Then one registration is returned with multiple target uris
      expect(registrations).toHaveLength(1);
      expect(registrations[0]).toEqual({
        forClass: "https://schema.org/VideoGame",
        targets: [
          {
            type: "container",
            uri: "https://pod.test/games/",
          },
          {
            type: "container",
            uri: "https://pod.test/more-games/",
          },
        ],
      });
    });

    it("returns a single registration for an instance", () => {
      // Given a type index with one registration for an instance container
      const store = graph();
      const typeIndexUri = "https://pod.test/settings/typeIndex.ttl";
      const registrationUri = `${typeIndexUri}#VideoGames`;

      store.add(
        quad(
          sym(registrationUri),
          solid("forClass"),
          schema("VideoGame"),
          sym(typeIndexUri),
        ),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instance"),
          sym("https://pod.test/games/minecraft#it"),
          sym(typeIndexUri),
        ),
      );

      const typeIndex = new TypeIndex(typeIndexUri, store);

      // When listing all entries
      const registrations = typeIndex.listAll();

      // Then one registration is returned with correct properties
      expect(registrations).toHaveLength(1);
      expect(registrations[0]).toEqual({
        forClass: "https://schema.org/VideoGame",
        targets: [
          {
            type: "instance",
            uri: "https://pod.test/games/minecraft#it",
          },
        ],
      });
    });

    it("does not return registrations from wrong document", () => {
      // Given a type index with one registration for an instance container
      const store = graph();
      const typeIndexUri = "https://pod.test/settings/typeIndex.ttl";
      const registrationUri = `${typeIndexUri}#VideoGames`;

      store.add(
        quad(
          sym(registrationUri),
          solid("forClass"),
          schema("VideoGame"),
          sym("https://wrong.dcument"),
        ),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instanceContainer"),
          sym("https://pod.test/games/"),
          sym(typeIndexUri),
        ),
      );

      const typeIndex = new TypeIndex(typeIndexUri, store);

      // When listing all entries
      const registrations = typeIndex.listAll();

      // Then nothing is returned
      expect(registrations).toEqual([]);
    });

    it("does not return instance containers from wrong document", () => {
      // Given a type index with one registration for an instance container
      const store = graph();
      const typeIndexUri = "https://pod.test/settings/typeIndex.ttl";
      const registrationUri = `${typeIndexUri}#VideoGames`;

      store.add(
        quad(
          sym(registrationUri),
          solid("forClass"),
          schema("VideoGame"),
          sym(typeIndexUri),
        ),
      );
      store.add(
        quad(
          sym(registrationUri),
          solid("instanceContainer"),
          sym("https://pod.test/games/"),
          sym("https://wrong.dcument"),
        ),
      );

      const typeIndex = new TypeIndex(typeIndexUri, store);

      // When listing all entries
      const registrations = typeIndex.listAll();

      // Then nothing is returned
      expect(registrations).toHaveLength(1);
      expect(registrations[0]).toEqual({
        targets: [],
        forClass: "https://schema.org/VideoGame",
      });
    });
  });
});
