import { when } from "jest-when";
import { graph, sym, quad, IndexedFormula, blankNode } from "rdflib";
import { Parser as SparqlParser, Update } from "sparqljs";
import { AuthenticatedFetch, PodOsSession } from "./authentication";
import { Store } from "./Store";
import { Thing } from "./thing";

jest.mock("./authentication");

describe("Store", () => {
  describe("additions$", () => {
    it("emits quads as they are added to the store", async () => {
      const mockSession = {} as unknown as PodOsSession;
      const internalStore = new IndexedFormula();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      const subscriber = jest.fn();
      store.additions$?.subscribe(subscriber);
      const quads = [
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://movie.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://movie.test/MovieClass"),
        ),
      ];
      internalStore.addAll(quads);
      expect(subscriber).toHaveBeenNthCalledWith(1, quads[0]);
      expect(subscriber).toHaveBeenNthCalledWith(2, quads[1]);
    });
  });

  describe("removals$", () => {
    it("emits quads as they are removed from the store", async () => {
      const mockSession = {} as unknown as PodOsSession;
      const internalStore = new IndexedFormula();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      const subscriber = jest.fn();
      store.removals$?.subscribe(subscriber);
      const quads = [
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://movie.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://movie.test/MovieClass"),
        ),
      ];
      internalStore.addAll(quads);
      internalStore.removeStatement(quads[0]);
      internalStore.removeStatement(quads[1]);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(subscriber).toHaveBeenNthCalledWith(1, quads[0]);
      expect(subscriber).toHaveBeenNthCalledWith(2, quads[1]);
    });
  });

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
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .',
            ),
        } as Response);
      const internalStore = graph();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      await store.fetch("https://pod.test/resource");
      expect(
        internalStore.statementsMatching(
          null,
          null,
          null,
          sym("https://pod.test/resource"),
        ),
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
      const internalStore = graph();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      await store.fetch("https://pod.test/resource.png");
      expect(
        internalStore.holds(
          sym("https://pod.test/resource.png"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://purl.org/dc/terms/Image"),
        ),
      ).toBe(true);
      expect(
        internalStore.holds(
          sym("https://pod.test/resource.png"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://www.w3.org/ns/iana/media-types/image/png#Resource"),
        ),
      ).toBe(true);
    });
  });

  describe("fetch all", () => {
    it("fetches and parses turtle data", async () => {
      // given
      const mockSession = {
        authenticatedFetch: jest.fn(),
      } as unknown as PodOsSession;
      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource1", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/turtle",
          }),
          text: () =>
            Promise.resolve(
              '<https://pod.test/resource1#it> <https://pod.test/vocab/predicate> "literal value 1" .',
            ),
        } as Response);
      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource2", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/turtle",
          }),
          text: () =>
            Promise.resolve(
              '<https://pod.test/resource2#it> <https://pod.test/vocab/predicate> "literal value 2" .',
            ),
        } as Response);
      const internalStore = graph();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      // when
      await store.fetchAll([
        "https://pod.test/resource1",
        "https://pod.test/resource2",
      ]);
      // then
      expect(
        internalStore.statementsMatching(
          null,
          null,
          null,
          sym("https://pod.test/resource1"),
        ),
      ).toEqual([
        {
          graph: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource1",
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
            value: "literal value 1",
          },
          predicate: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/vocab/predicate",
          },
          subject: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource1#it",
          },
        },
      ]);
      expect(
        internalStore.statementsMatching(
          null,
          null,
          null,
          sym("https://pod.test/resource2"),
        ),
      ).toEqual([
        {
          graph: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource2",
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
            value: "literal value 2",
          },
          predicate: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/vocab/predicate",
          },
          subject: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource2#it",
          },
        },
      ]);
    });

    it("fetches data from second resource even if first failed", async () => {
      // given
      const mockSession = {
        authenticatedFetch: jest.fn(),
      } as unknown as PodOsSession;
      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource1", expect.anything())
        .mockResolvedValue({
          ok: false,
          status: 500,
          statusText: "Internal Server Error",
          headers: new Headers({
            "Content-Type": "text/plain",
          }),
          text: () => Promise.resolve("Internal Server Error"),
        } as Response);
      when(mockSession.authenticatedFetch)
        .calledWith("https://pod.test/resource2", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "text/turtle",
          }),
          text: () =>
            Promise.resolve(
              '<https://pod.test/resource2#it> <https://pod.test/vocab/predicate> "literal value 2" .',
            ),
        } as Response);
      const internalStore = graph();
      const store = new Store(mockSession, undefined, undefined, internalStore);
      // when
      const result = await store.fetchAll([
        "https://pod.test/resource1",
        "https://pod.test/resource2",
      ]);
      // then
      expect(result.length).toBe(2);
      expect(result[0].status).toBe("rejected");
      expect(result[1].status).toBe("fulfilled");
      expect(
        internalStore.statementsMatching(
          null,
          null,
          null,
          sym("https://pod.test/resource2"),
        ),
      ).toEqual([
        {
          graph: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource2",
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
            value: "literal value 2",
          },
          predicate: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/vocab/predicate",
          },
          subject: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://pod.test/resource2#it",
          },
        },
      ]);
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
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .',
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
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .',
            ),
        } as Response);

      const store = new Store(mockSession);

      await store.fetch("https://pod.test/resource");

      const result = store.get("https://pod.test/resource");

      expect(result.editable).toBe(true);
    });
  });

  describe("add property value", () => {
    it("sends sparql insert via updater", async () => {
      const fetchMock = jest.fn();
      const mockSession = {
        authenticatedFetch: fetchMock,
      } as unknown as PodOsSession;
      when(fetchMock)
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
              '<https://pod.test/resource#it> <https://pod.test/vocab/predicate> "literal value" .',
            ),
        } as Response);
      const store = new Store(mockSession);
      await store.fetch("https://pod.test/resource");
      const thing = store.get("https://pod.test/resource");
      await store.addPropertyValue(
        thing,
        "https://vocab.example#property",
        "the value",
      );
      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        "https://pod.test/resource",
        `
      INSERT DATA {
        <https://pod.test/resource>
          <https://vocab.example#property> "the value" .
      }`,
      );
    });
  });

  describe("add new thing", () => {
    it("sends sparql insert via updater", async () => {
      const fetchMock = jest.fn();
      const mockSession = {
        authenticatedFetch: fetchMock,
      } as unknown as PodOsSession;
      when(fetchMock)
        .calledWith("https://pod.test/new-thing", expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 404,
          statusText: "Not found",
          headers: new Headers({
            "Content-Type": "text/plain",
            "wac-allow": 'user="read write append control",public="read"',
            "accept-patch": "application/sparql-update",
            allow: "PATCH, PUT",
          }),
          text: () => Promise.resolve("Not found"),
        } as Response);

      const store = new Store(mockSession);
      await store.addNewThing(
        "https://pod.test/new-thing#it",
        "A new thing",
        "https://vocab.example/Thing",
      );

      thenSparqlUpdateIsSentToUrl(
        fetchMock,
        "https://pod.test/new-thing",
        `
      INSERT DATA {
        <https://pod.test/new-thing#it>
          <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://vocab.example/Thing> ;
          <http://www.w3.org/2000/01/rdf-schema#label> "A new thing" .
      }`,
      );
    });
  });

  describe("findTypes", () => {
    let store: Store;
    beforeEach(() => {
      const internalStore = graph();
      store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      internalStore.addAll([
        quad(
          sym("http://recipe.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://recipe.test/RecipeClass"),
          sym("http://www.w3.org/2000/01/rdf-schema#subClassOf"),
          sym("http://schema.org/Recipe"),
        ),
        quad(
          sym("http://recipe.test/2"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://recipe.test/RecipeClass"),
        ),
        quad(
          sym("http://movie.test/1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://movie.test/MovieClass"),
        ),
        quad(
          blankNode("1"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://schema.org/Recipe"),
        ),
      ]);
    });

    it("finds types of a URI", () => {
      const recipe1classes = store.findTypes("http://recipe.test/1");
      expect(recipe1classes).toEqual(["http://schema.org/Recipe"]);
      const recipe2classes = store.findTypes("http://recipe.test/2");
      expect(recipe2classes).toContain("http://schema.org/Recipe");
      expect(recipe2classes).toContain("http://recipe.test/RecipeClass");
      expect(recipe2classes).toEqual(
        expect.not.arrayContaining(["http://movie.test/MovieClass"]),
      );
    });

    it("supports named nodes as argument", () => {
      const recipe1classes = store.findTypes(sym("http://recipe.test/1"));
      expect(recipe1classes).toEqual(["http://schema.org/Recipe"]);
    });

    it("supports blank nodes as argument", () => {
      const classes = store.findTypes(blankNode("1"));
      expect(classes).toEqual(["http://schema.org/Recipe"]);
    });
  });

  describe("preferencesQuery", () => {
    it("instantiates PreferencesQuery using provided internal store", () => {
      const internalStore = graph();
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      const webId = "https://pod.test/alice/profile/card#me";
      const preferencesDoc = "https://pod.test/alice/settings/prefs.ttl";
      internalStore.add(
        sym(webId),
        sym("http://www.w3.org/ns/solid/terms#privateTypeIndex"),
        sym("https://pod.test/alice/settings/privateTypeIndex.ttl"),
        sym(preferencesDoc),
      );
      const query = store.preferencesQuery(webId, preferencesDoc);
      const result = query.queryPrivateTypeIndex();
      expect(result).toEqual(
        sym("https://pod.test/alice/settings/privateTypeIndex.ttl"),
      );
    });

    it("supports named nodes as arguments", () => {
      const internalStore = graph();
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      const webIdNode = sym("https://pod.test/alice/profile/card#me");
      const preferencesDocNode = sym(
        "https://pod.test/alice/settings/prefs.ttl",
      );
      internalStore.add(
        webIdNode,
        sym("http://www.w3.org/ns/solid/terms#privateTypeIndex"),
        sym("https://pod.test/alice/settings/privateTypeIndex.ttl"),
        preferencesDocNode,
      );
      const query = store.preferencesQuery(webIdNode, preferencesDocNode);
      const result = query.queryPrivateTypeIndex();
      expect(result).toEqual(
        sym("https://pod.test/alice/settings/privateTypeIndex.ttl"),
      );
    });
  });

  describe("profileQuery", () => {
    it("instantiates ProfileQuery using provided internal store", () => {
      const internalStore = graph();
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      const webId = "https://pod.test/alice/profile/card#me";
      internalStore.add(
        sym(webId),
        sym("http://www.w3.org/ns/solid/terms#publicTypeIndex"),
        sym("https://pod.test/alice/settings/publicTypeIndex.ttl"),
        sym(webId).doc(),
      );
      const query = store.profileQuery(webId);
      const result = query.queryPublicTypeIndex();
      expect(result).toEqual(
        sym("https://pod.test/alice/settings/publicTypeIndex.ttl"),
      );
    });

    it("supports named node as argument", () => {
      const internalStore = graph();
      const store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      const webIdNode = sym("https://pod.test/alice/profile/card#me");
      internalStore.add(
        webIdNode,
        sym("http://www.w3.org/ns/solid/terms#publicTypeIndex"),
        sym("https://pod.test/alice/settings/publicTypeIndex.ttl"),
        webIdNode.doc(),
      );
      const query = store.profileQuery(webIdNode);
      const result = query.queryPublicTypeIndex();
      expect(result).toEqual(
        sym("https://pod.test/alice/settings/publicTypeIndex.ttl"),
      );
    });
  });
});

export function thenSparqlUpdateIsSentToUrl(
  fetchMock: jest.Mock<AuthenticatedFetch>,
  url: string,
  query: string,
) {
  expect(fetchMock).toHaveBeenCalled();

  const parser = new SparqlParser();

  const calls = fetchMock.mock.calls;
  const sparqlUpdateCall = calls.find(
    (it) => it[0] === url && it[1].method === "PATCH",
  );

  expect(sparqlUpdateCall).toBeDefined();

  const body = sparqlUpdateCall[1].body;
  const actualQuery = parser.parse(body) as Update;
  const expectedQuery = parser.parse(query) as Update;
  expect(actualQuery).toEqual(expectedQuery);
}
