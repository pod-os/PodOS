import { SearchGateway } from "./SearchGateway";
import { PodOsSession } from "../authentication";
import { Store } from "../Store";

import {
  expectPatchRequest,
  expectPutEmptyTurtleFile,
  mockNotFound,
  mockTurtleDocument,
  // @ts-expect-error compiler does not recognize import correctly
} from "@solid-data-modules/rdflib-utils/test-support";
import { WebIdProfile } from "../profile";
import { st, sym } from "rdflib";
import { pim } from "../namespaces";

describe(SearchGateway.name, () => {
  describe("create default label index", () => {
    describe("given no preferences document exists", () => {
      it("creates a new label index document next to the profile and links it to the user in the profile document", async () => {
        // given a session and a store
        const fetchMock = jest.fn();
        const mockSession = {
          authenticatedFetch: fetchMock,
        } as unknown as PodOsSession;
        const store = new Store(mockSession);
        const gateway = new SearchGateway(store);

        // and no label index yet
        mockNotFound(
          fetchMock,
          "https://pod.example/profile/privateLabelIndex.ttl",
        );

        // and no link in the profile
        mockTurtleDocument(fetchMock, "https://pod.example/profile/card", "");

        // when a new label index is created for that profile
        await gateway.createDefaultLabelIndex(
          new WebIdProfile(
            "https://pod.example/profile/card#me",
            store.graph,
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

        // and an empty index document is created
        expectPutEmptyTurtleFile(
          fetchMock,
          "https://pod.example/profile/privateLabelIndex.ttl",
        );
      });
    });
    describe("given a preferences document exists", () => {
      it("creates a new label index document next to the preferences document and links it to the user in the preferences document", async () => {
        // given a session and a store
        const fetchMock = jest.fn();
        const mockSession = {
          authenticatedFetch: fetchMock,
        } as unknown as PodOsSession;
        const store = new Store(mockSession);
        const gateway = new SearchGateway(store);

        // and no label index yet
        mockNotFound(
          fetchMock,
          "https://pod.example/settings/privateLabelIndex.ttl",
        );

        // and the profile links to a preferences document
        store.graph.add(
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
        await gateway.createDefaultLabelIndex(
          new WebIdProfile(
            "https://pod.example/profile/card#me",
            store.graph,
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

        // and an empty index document is created
        expectPutEmptyTurtleFile(
          fetchMock,
          "https://pod.example/settings/privateLabelIndex.ttl",
        );
      });
    });
  });
});
