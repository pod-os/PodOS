import { sym } from "rdflib";
import { Store } from "./Store";
import { BrowserSession } from "./authentication";
import { when } from "jest-when";

jest.mock("./authentication");

describe("Store", () => {
  it("fetches and parses turtle data", async () => {
    const mockSession = {
      authenticatedFetch: jest.fn(),
    } as unknown as BrowserSession;
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
});
