import { SearchGateway } from "./SearchGateway";
import { PodOsSession } from "../authentication";
import { Store } from "../Store";

import {
  expectPatchRequest,
  mockNotFound,
  mockTurtleDocument,
} from "@solid-data-modules/rdflib-utils/test-support";
import { WebIdProfile } from "../profile";
import { graph, lit, st, sym } from "rdflib";
import { pim, rdfs } from "../namespaces";
import { LabelIndex } from "./LabelIndex";
import { Thing } from "../thing";
import { solid } from "@solid-data-modules/rdflib-utils";

describe(SearchGateway.name, () => {
  describe("build search index", () => {
    it("creates an index that can find indexed items", async () => {
      // given a session and a store
      const fetchMock = jest.fn();
      const mockSession = {
        authenticatedFetch: fetchMock,
      } as unknown as PodOsSession;
      const internalStore = graph();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      const gateway = new SearchGateway(store);

      // and a profile with a private label index
      internalStore.add(
        st(
          sym("https://pod.test/profile/card#me"),
          solid("privateLabelIndex"),
          sym("https://pod.test/profile/privateLabelIndex.ttl"),
          sym("https://pod.test/profile/card"),
        ),
      );
      const profile = store
        .get("https://pod.test/profile/card#me")
        .assume(WebIdProfile);

      // and the index contains data
      mockTurtleDocument(
        fetchMock,
        "https://pod.test/profile/privateLabelIndex.ttl",
        `
      <https://pod.test/some/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "Test Thing" .
    `,
      );

      // when building a search index for that profile
      const searchIndex = await gateway.buildSearchIndex(profile);

      // then the search can find the indexed item
      const result = searchIndex.search("test");
      expect(result).toHaveLength(1);
      expect(result[0].ref).toEqual("https://pod.test/some/thing#it");
    });
  });

  describe("add to label index", () => {
    it("patches the label index with a label found in the store", async () => {
      // given a session and a store
      const fetchMock = jest.fn();
      const mockSession = {
        authenticatedFetch: fetchMock,
      } as unknown as PodOsSession;
      const internalStore = graph();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      const gateway = new SearchGateway(store);

      // and no label index yet
      mockNotFound(fetchMock, "https://pod.example/label-index");

      // and the store contains a label for a thing
      internalStore.add(
        st(sym("https://thing.example#it"), rdfs("label"), lit("Something")),
      );

      // when that thing is added to a label index
      await gateway.addToLabelIndex(
        new Thing("https://thing.example#it", internalStore, true),
        new LabelIndex("https://pod.example/label-index", internalStore, true),
      );

      // then the label of the thing is patched into the label index document
      expectPatchRequest(
        fetchMock,
        "https://pod.example/label-index",
        `@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix ex: <http://www.example.org/terms#>.

_:patch

      solid:inserts {
        <https://thing.example#it> <http://www.w3.org/2000/01/rdf-schema#label> "Something" .
      };   a solid:InsertDeletePatch .`,
      );
    });
  });

  describe("create default label index", () => {
    describe("given no preferences document exists", () => {
      it("creates a new label index document next to the profile and links it to the user in the profile document", async () => {
        // given a session and a store
        const fetchMock = jest.fn();
        const mockSession = {
          authenticatedFetch: fetchMock,
        } as unknown as PodOsSession;
        const internalStore = graph();
        const store = new Store(
          mockSession,
          undefined,
          undefined,
          internalStore,
        );
        const gateway = new SearchGateway(store);

        // and no label index yet
        mockNotFound(
          fetchMock,
          "https://pod.example/profile/privateLabelIndex.ttl",
        );

        // and no link in the profile
        mockTurtleDocument(fetchMock, "https://pod.example/profile/card", "");

        // when a new label index is created for that profile
        const result = await gateway.createDefaultLabelIndex(
          new WebIdProfile(
            "https://pod.example/profile/card#me",
            internalStore,
            true,
          ),
        );

        // then the label index document is linked to the profile within the profile document
        expectPatchRequest(
          fetchMock,
          "https://pod.example/profile/card",
          `@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix ex: <http://www.example.org/terms#>.

_:patch

      solid:inserts {
        <https://pod.example/profile/card#me> <http://www.w3.org/ns/solid/terms#privateLabelIndex> <https://pod.example/profile/privateLabelIndex.ttl> .
      };   a solid:InsertDeletePatch .`,
        );

        // and an index document is created with a name
        expectPatchRequest(
          fetchMock,
          "https://pod.example/profile/privateLabelIndex.ttl",
          `@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix ex: <http://www.example.org/terms#>.

_:patch

      solid:inserts {
        <https://pod.example/profile/privateLabelIndex.ttl> <http://www.w3.org/2000/01/rdf-schema#label> "Default Index" .
      };   a solid:InsertDeletePatch .`,
        );

        // and a label index instance is returned representing that index
        expect(result).toBeInstanceOf(LabelIndex);
        expect(result.uri).toEqual(
          "https://pod.example/profile/privateLabelIndex.ttl",
        );
        expect(result.label()).toEqual("Default Index");
      });
    });
    describe("given a preferences document exists", () => {
      it("creates a new label index document next to the preferences document and links it to the user in the preferences document", async () => {
        // given a session and a store
        const fetchMock = jest.fn();
        const mockSession = {
          authenticatedFetch: fetchMock,
        } as unknown as PodOsSession;
        const internalStore = graph();
        const store = new Store(
          mockSession,
          undefined,
          undefined,
          internalStore,
        );
        const gateway = new SearchGateway(store);

        // and no label index yet
        mockNotFound(
          fetchMock,
          "https://pod.example/settings/privateLabelIndex.ttl",
        );

        // and the profile links to a preferences document
        internalStore.add(
          st(
            sym("https://pod.example/profile/card#me"),
            pim("preferencesFile"),
            sym("https://pod.example/settings/prefs.ttl"),
            sym("https://pod.example/profile/card"),
          ),
        );

        // and the preferences document is empty
        mockTurtleDocument(
          fetchMock,
          "https://pod.example/settings/prefs.ttl",
          "",
        );

        // when a new label index is created for that profile
        const result = await gateway.createDefaultLabelIndex(
          new WebIdProfile(
            "https://pod.example/profile/card#me",
            internalStore,
            true,
          ),
        );

        // then the label index document is linked to the profile within the profile document
        expectPatchRequest(
          fetchMock,
          "https://pod.example/settings/prefs.ttl",
          `@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix ex: <http://www.example.org/terms#>.

_:patch

      solid:inserts {
        <https://pod.example/profile/card#me> <http://www.w3.org/ns/solid/terms#privateLabelIndex> <https://pod.example/settings/privateLabelIndex.ttl> .
      };   a solid:InsertDeletePatch .`,
        );

        // and an index document is created with a name
        expectPatchRequest(
          fetchMock,
          "https://pod.example/settings/privateLabelIndex.ttl",
          `@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix ex: <http://www.example.org/terms#>.

_:patch

      solid:inserts {
        <https://pod.example/settings/privateLabelIndex.ttl> <http://www.w3.org/2000/01/rdf-schema#label> "Default Index" .
      };   a solid:InsertDeletePatch .`,
        );

        // and a label index instance is returned representing that index
        expect(result).toBeInstanceOf(LabelIndex);
        expect(result.uri).toEqual(
          "https://pod.example/settings/privateLabelIndex.ttl",
        );
        expect(result.label()).toEqual("Default Index");
      });
    });
  });
});
