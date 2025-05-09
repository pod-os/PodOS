import { OfflineCapableFetcher } from "./fetcher";
import { graph, sym } from "rdflib";
// @ts-expect-error compiler does not resolve module correctly
import { mockTurtleDocument } from "@solid-data-modules/rdflib-utils/test-support";

describe(OfflineCapableFetcher.name, () => {
  it("loads data to the store from network normally", async () => {
    const fetch = jest.fn();
    mockTurtleDocument(
      fetch,
      "https://alice.pod.test/thing",
      `
      <https://alice.pod.test/thing#it> <http://www.w3.org/2000/01/rdf-schema#label> "A thing".
    `,
    );
    const store = graph();
    const fetcher = new OfflineCapableFetcher(store, { fetch });
    await fetcher.load("https://alice.pod.test/thing");

    const statements = store.statementsMatching(
      null,
      null,
      null,
      sym("https://alice.pod.test/thing"),
    );
    expect(statements).toEqual([
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
  });
});
