import { OfflineCapableFetcher } from "./fetcher";
import { graph, sym } from "rdflib";
import { when } from "jest-when";
import { OfflineCache } from "./OfflineCache";

describe(OfflineCapableFetcher.name, () => {
  it("loads data to the store from network normally", async () => {
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
    const offlineCache = {
      put: jest.fn(),
    } as OfflineCache;
    const fetcher = new OfflineCapableFetcher(store, {
      fetch,
      offlineCache,
      isOnline: () => true,
    });

    // when the fetcher loads a resource from that document
    const response = await fetcher.load("https://alice.pod.test/thing#it");

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
      statements: [
        '<https://alice.pod.test/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "A thing" .',
      ],
    });
  });
});

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
