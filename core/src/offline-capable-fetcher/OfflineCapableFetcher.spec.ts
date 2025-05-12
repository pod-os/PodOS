import { OfflineCapableFetcher } from "./OfflineCapableFetcher";
import { graph, sym } from "rdflib";
import { when } from "jest-when";
import { OfflineCache } from "./OfflineCache";

describe(OfflineCapableFetcher.name, () => {
  describe("while online", () => {
    it.each([
      {
        argumentType: "uri string",
        uriArg: "https://alice.pod.test/thing#it",
      },
      {
        argumentType: "NamedNode",
        uriArg: sym("https://alice.pod.test/thing#it"),
      },
    ])(
      `fetches document for given $argumentType and puts data to store and offline cache`,
      async ({ uriArg }) => {
        // given a turtle document can be fetched
        const fetch = jest.fn();
        mockTurtleDocument(
          fetch,
          "https://alice.pod.test/thing",
          `
      <https://alice.pod.test/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "A thing".
    `,
          { etag: 'W/"1234567890"' },
        );
        const store = graph();

        // and a fetcher that is currently online
        const offlineCache = mockOfflineCache();
        const fetcher = new OfflineCapableFetcher(store, {
          fetch,
          offlineCache,
          isOnline: () => true,
        });

        // when the fetcher loads a resource from that document
        const response = await fetcher.load(uriArg as string); // typecast to string is a workaround to satisfy the type checker

        // then the etag can be read from the response
        expect(response.headers.get("etag")).toEqual('W/"1234567890"');

        // and all the statements from the document are in the store
        const statementsInStore = store.statementsMatching(
          null,
          null,
          null,
          sym("https://alice.pod.test/thing"),
        );
        expect(statementsInStore).toEqual([
          {
            graph: {
              classOrder: 5,
              termType: "NamedNode",
              value: "https://alice.pod.test/thing",
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
              value: "A thing",
            },
            predicate: {
              classOrder: 5,
              termType: "NamedNode",
              value: "http://www.w3.org/2000/01/rdf-schema#label",
            },
            subject: {
              classOrder: 5,
              termType: "NamedNode",
              value: "https://alice.pod.test/thing#it",
            },
          },
        ]);

        // and the statements have been added to the offline cache using etag as revision
        expect(offlineCache.put).toHaveBeenCalledWith({
          url: "https://alice.pod.test/thing",
          revision: 'W/"1234567890"',
          statements:
            '<https://alice.pod.test/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "A thing" .',
        });
      },
    );

    it("fetches multiple documents if array is given and puts all the data to the store and offline cache", async () => {
      // given two turtle documents can be fetched
      const fetch = jest.fn();
      mockTurtleDocument(
        fetch,
        "https://alice.pod.test/one",
        `
      <https://alice.pod.test/one#it> <http://www.w3.org/2000/01/rdf-schema#label> "First".
    `,
        { etag: "etag-doc-1" },
      );
      mockTurtleDocument(
        fetch,
        "https://alice.pod.test/two",
        `
      <https://alice.pod.test/two#it> <http://www.w3.org/2000/01/rdf-schema#label> "Second".
    `,
        { etag: "etag-doc-2" },
      );
      const store = graph();

      // and a fetcher that is currently online
      const offlineCache = mockOfflineCache();
      const fetcher = new OfflineCapableFetcher(store, {
        fetch,
        offlineCache,
        isOnline: () => true,
      });

      // when the fetcher loads resources from those documents in parallel
      const responses = await fetcher.load([
        "https://alice.pod.test/one#it", // one uri given as string
        sym("https://alice.pod.test/two#it"), // another uri given as NamedNode
      ]);

      // then the etag can be read from the responses
      expect(responses[0].headers.get("etag")).toEqual("etag-doc-1");
      expect(responses[1].headers.get("etag")).toEqual("etag-doc-2");

      // and all the statements from the documents are in the store
      const statementsOfFirstDoc = store.statementsMatching(
        null,
        null,
        null,
        sym("https://alice.pod.test/one"),
      );
      const statementsOfSecondDoc = store.statementsMatching(
        null,
        null,
        null,
        sym("https://alice.pod.test/two"),
      );
      expect(statementsOfFirstDoc).toEqual([
        {
          graph: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://alice.pod.test/one",
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
            value: "First",
          },
          predicate: {
            classOrder: 5,
            termType: "NamedNode",
            value: "http://www.w3.org/2000/01/rdf-schema#label",
          },
          subject: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://alice.pod.test/one#it",
          },
        },
      ]);

      expect(statementsOfSecondDoc).toEqual([
        {
          graph: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://alice.pod.test/two",
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
            value: "Second",
          },
          predicate: {
            classOrder: 5,
            termType: "NamedNode",
            value: "http://www.w3.org/2000/01/rdf-schema#label",
          },
          subject: {
            classOrder: 5,
            termType: "NamedNode",
            value: "https://alice.pod.test/two#it",
          },
        },
      ]);

      // and the statements have been added to the offline cache using etag as revision
      expect(offlineCache.put).toHaveBeenCalledWith({
        url: "https://alice.pod.test/one",
        revision: "etag-doc-1",
        statements: `<https://alice.pod.test/one#it> <http://www.w3.org/2000/01/rdf-schema#label> "First" .`,
      });
      expect(offlineCache.put).toHaveBeenCalledWith({
        url: "https://alice.pod.test/two",
        revision: "etag-doc-2",
        statements:
          '<https://alice.pod.test/two#it> <http://www.w3.org/2000/01/rdf-schema#label> "Second" .',
      });
    });
  });
});

function mockOfflineCache(): OfflineCache {
  return {
    put: jest.fn(),
    get: jest.fn(),
  };
}

/**
 * TODO Copied from @solid-data-modules/rdflib-utils to add custom headers
 */
export function mockTurtleDocument(
  fetch: jest.Mock,
  url: string,
  ttl: string,
  additionalHeaders: Record<string, string> = {},
) {
  when(fetch)
    .calledWith(url, expect.anything())
    .mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "Content-Type": "text/turtle",
        link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
        "wac-allow": 'user="read write append control",public="read"',
        "accept-patch": "text/n3",
        ...additionalHeaders,
      }),
      text: () => Promise.resolve(ttl),
    } as Response);
}
