import { when } from "jest-when";
import { sym } from "rdflib";
import { PodOsSession } from "./authentication";
import { Store } from "./Store";
import { Thing } from "./thing";

jest.mock("./authentication");

describe("Store", () => {
  describe("fetch", () => {
    it("fetches and parses turtle data", async () => {
      const mockSession = {
        authenticatedFetch: jest.fn(),
      } as unknown as PodOsSession;
      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/turtle",
          }),
          text: () =>
            Promise.resolve(
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .'
            ),
        } as Response);
      const store = new Store(mockSession);
      await store.fetch("https://pod.test/resource");
      expect(
        store.graph.statementsMatching(
          null,
          null,
          null,
          sym("https://pod.test/resource")
        )
      ).toEqual([
        {
          graph: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource",
          },
          object: {
            classOrder: 1,
            datatype: {
              classOrder: 5,
              termType: "NamedNode",
              value: "http://www.w3.org/2001/XMLSchema#string",
            },
            isVar: 0,
            language: "",
            termType: "Literal",
            value: "literal value",
          },
          predicate: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/vocab/predicate",
          },
          subject: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource#it",
          },
        },
      ]);
    });

    it("fetches image type", async () => {
      const mockSession = {
        authenticatedFetch: jest.fn(),
      } as unknown as PodOsSession;
      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource.png", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "image/png",
          }),
        } as unknown as Response);
      const store = new Store(mockSession);
      await store.fetch("https://pod.test/resource.png");
      expect(
        store.graph.holds(
          sym("https://pod.test/resource.png"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://purl.org/dc/terms/Image")
        )
      ).toBe(true);
      expect(
        store.graph.holds(
          sym("https://pod.test/resource.png"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://www.w3.org/ns/iana/media-types/image/png#Resource")
        )
      ).toBe(true);
    });
  });

  describe("get", () => {
    it("returns a new read-only Thing", async () => {
      const mockSession = {
        authenticatedFetch: jest.fn(),
      } as unknown as PodOsSession;

      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/turtle",
            "wac-allow": 'user="read",public="read"',
            "accept-patch": "application/sparql-update",
          }),
          text: () =>
            Promise.resolve(
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .'
            ),
        } as Response);

      const store = new Store(mockSession);

      await store.fetch("https://pod.test/resource");

      const result = store.get("https://pod.test/resource");

      expect(result).toBeInstanceOf(Thing);
      expect(result.uri).toEqual("https://pod.test/resource");
      expect(result.editable).toBe(false);
    });

    it("returns an editable Thing", async () => {
      const mockSession = {
        authenticatedFetch: jest.fn(),
      } as unknown as PodOsSession;

      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/turtle",
            "wac-allow": 'user="read write append control",public="read"',
            "accept-patch": "application/sparql-update",
          }),
          text: () =>
            Promise.resolve(
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .'
            ),
        } as Response);

      const store = new Store(mockSession);

      await store.fetch("https://pod.test/resource");

      const result = store.get("https://pod.test/resource");

      expect(result.editable).toBe(true);
    });
  });
});
