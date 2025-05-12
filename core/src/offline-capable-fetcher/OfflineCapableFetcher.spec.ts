import { OfflineCapableFetcher } from "./OfflineCapableFetcher";
import { graph, sym } from "rdflib";
import { when } from "jest-when";
import { OfflineCache } from "./OfflineCache";
// @ts-expect-error compiler does not resolve module correctly
import { mockTurtleDocument } from "@solid-data-modules/rdflib-utils/test-support";

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

  describe("while offline", () => {
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
      `retrieves document for given $argumentType from cache and puts data to store`,
      async ({ uriArg }) => {
        // given a fetch function
        const fetch = jest.fn();

        // and an empty store
        const store = graph();

        // and an offline cache containing a document
        const offlineCache = mockOfflineCache();
        when(offlineCache.get)
          .calledWith("https://alice.pod.test/thing")
          .mockResolvedValueOnce({
            url: "https://alice.pod.test/thing",
            revision: "some-revision",
            statements: `<https://alice.pod.test/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "Cached value" .`,
          });

        // and a fetcher that is currently offline
        const fetcher = new OfflineCapableFetcher(store, {
          fetch,
          offlineCache,
          isOnline: () => false,
        });

        // when the fetcher is supposed to load a resource from that document
        const response = await fetcher.load(uriArg as string); // typecast to string is a workaround to satisfy the type checker

        // then a fake response is returned using the cached data
        expect(response.status).toEqual(200);
        expect(response.headers.get("etag")).toEqual("some-revision");
        expect(response.headers.get("Content-Type")).toEqual("text/turtle");
        expect(await response.text()).toEqual(
          '<https://alice.pod.test/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "Cached value" .',
        );

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
              value: "Cached value",
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

        // and nothing was ever fetched
        expect(fetch).not.toHaveBeenCalled();
      },
    );

    it(`throws an error if document was not found in cache`, async () => {
      // given a fetch function
      const fetch = jest.fn();

      // and an empty store
      const store = graph();

      // and an empty offline cache
      const offlineCache = mockOfflineCache();
      when(offlineCache.get).mockResolvedValue(undefined);

      // and a fetcher that is currently offline
      const fetcher = new OfflineCapableFetcher(store, {
        fetch,
        offlineCache,
        isOnline: () => false,
      });

      // when the fetcher is supposed to load a resource
      const fetchPromise = fetcher.load("https://alice.pod.test/thing#it");

      // then an error is thrown indicating a cache miss
      await expect(fetchPromise).rejects.toThrow(
        new Error(
          "You are offline and no data was found in the offline cache for https://alice.pod.test/thing",
        ),
      );

      // and the store stays empty
      const statementsInStore = store.statementsMatching(
        null,
        null,
        null,
        sym("https://alice.pod.test/thing"),
      );
      expect(statementsInStore).toHaveLength(0);

      // and nothing was ever fetched
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});

function mockOfflineCache(): OfflineCache {
  return {
    put: jest.fn(),
    get: jest.fn(),
  };
}
