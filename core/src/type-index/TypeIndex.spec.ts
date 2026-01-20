import { graph, quad, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { TypeIndex } from "./TypeIndex";
import { solid } from "@solid-data-modules/rdflib-utils";
import { schema } from "../namespaces";
import { Store } from "../Store";

describe("TypeIndex", () => {
  let store: IndexedFormula;
  const mockSession = {} as unknown as PodOsSession;
  let reactiveStore: Store;

  beforeEach(() => {
    store = graph();
    reactiveStore = new Store(mockSession, undefined, undefined, store);
  });

  describe("listAll", () => {
    it("returns empty list if nothing is in store", () => {
      // Given: a type index with an empty store
      const emptyStore = store;
      const typeIndex = new TypeIndex(
        "https://pod.test/type-index.ttl",
        emptyStore,
        reactiveStore,
      );

      // When: calling listAll
      const registrations = typeIndex.listAll();

      // Then: an empty array is returned
      expect(registrations).toEqual([]);
    });

    describe("instance containers", () => {
      it("returns a single registration for an instance container", () => {
        // Given a type index with one registration for an instance container
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

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then one registration is returned with correct properties
        expect(registrations).toHaveLength(1);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/VideoGame",
            targets: [
              {
                type: "container",
                uri: "https://pod.test/games/",
              },
            ],
          }),
        );
      });

      it("returns a single registration with multiple instance containers", () => {
        // Given a type index with one registration for several instance containers
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

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then one registration is returned with multiple target uris
        expect(registrations).toHaveLength(1);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
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
          }),
        );
      });
    });

    describe("single instance", () => {
      it("returns a single registration for an instance", () => {
        // Given a type index with one registration for an instance container
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

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then one registration is returned with correct properties
        expect(registrations).toHaveLength(1);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/VideoGame",
            targets: [
              {
                type: "instance",
                uri: "https://pod.test/games/minecraft#it",
              },
            ],
          }),
        );
      });

      it("returns a single registration with multiple instances", () => {
        // Given a type index with one registration for several instances
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
        store.add(
          quad(
            sym(registrationUri),
            solid("instance"),
            sym("https://pod.test/games/fallout3#it"),
            sym(typeIndexUri),
          ),
        );

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then one registration is returned with multiple target uris
        expect(registrations).toHaveLength(1);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/VideoGame",
            targets: [
              {
                type: "instance",
                uri: "https://pod.test/games/minecraft#it",
              },
              {
                type: "instance",
                uri: "https://pod.test/games/fallout3#it",
              },
            ],
          }),
        );
      });
    });

    describe("multiple registrations", () => {
      it("returns multiple registration for different classes", () => {
        // Given a type index with registrations for two different classes
        const typeIndexUri = "https://pod.test/settings/typeIndex.ttl";
        const firstRegistrationUri = `${typeIndexUri}#FirstRegistration`;
        const secondRegistrationUri = `${typeIndexUri}#SecondRegistration`;

        store.add(
          quad(
            sym(firstRegistrationUri),
            solid("forClass"),
            schema("VideoGame"),
            sym(typeIndexUri),
          ),
        );
        store.add(
          quad(
            sym(firstRegistrationUri),
            solid("instanceContainer"),
            sym("https://pod.test/games/"),
            sym(typeIndexUri),
          ),
        );
        store.add(
          quad(
            sym(secondRegistrationUri),
            solid("forClass"),
            schema("Thing"),
            sym(typeIndexUri),
          ),
        );
        store.add(
          quad(
            sym(secondRegistrationUri),
            solid("instanceContainer"),
            sym("https://pod.test/things/"),
            sym(typeIndexUri),
          ),
        );

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then both registrations are returned
        expect(registrations).toHaveLength(2);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/VideoGame",
            targets: [
              {
                type: "container",
                uri: "https://pod.test/games/",
              },
            ],
          }),
        );
        expect(registrations[1]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/Thing",
            targets: [
              {
                type: "container",
                uri: "https://pod.test/things/",
              },
            ],
          }),
        );
      });
    });

    describe("document verification", () => {
      it("does not return registrations from wrong document", () => {
        // Given a type index with one registration for an instance container
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

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then nothing is returned
        expect(registrations).toEqual([]);
      });

      it("does not return instance containers from wrong document", () => {
        // Given a type index with one registration for an instance container
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

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then nothing is returned
        expect(registrations).toHaveLength(1);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/VideoGame",
            targets: [],
          }),
        );
      });

      it("does not return instances from wrong document", () => {
        // Given a type index with one registration for an instance container
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
            sym("https://wrong.dcument"),
          ),
        );

        const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

        // When listing all entries
        const registrations = typeIndex.listAll();

        // Then nothing is returned
        expect(registrations).toHaveLength(1);
        expect(registrations[0]).toEqual(
          expect.objectContaining({
            forClass: "https://schema.org/VideoGame",
            targets: [],
          }),
        );
      });
    });
  });

  describe("label for class URI", () => {
    it("includes a short label for the class URI", () => {
      // Given: a type index with a registration for a class
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

      const typeIndex = new TypeIndex(typeIndexUri, store, reactiveStore);

      // When: listing all entries
      const registrations = typeIndex.listAll();

      // Then: the registration includes a label for the class URI
      expect(registrations).toHaveLength(1);
      expect(registrations[0]).toHaveProperty("label");
      expect(registrations[0].label).toBe("VideoGame");
    });
  });
});
