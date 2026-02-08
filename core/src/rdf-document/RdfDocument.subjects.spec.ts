import { blankNode, graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { RdfDocument } from "./RdfDocument";
import { Store } from "../Store";

describe("RdfDocument", () => {
  describe("subjects", () => {
    let internalStore: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let store: Store;

    beforeEach(() => {
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
    });

    it("does not find any subjects if store is empty", () => {
      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });

    it("returns single subject if available", () => {
      internalStore.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(1);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#it",
      });
    });

    it("return all subjects that are found", () => {
      internalStore.add(
        sym("http://pod.example/document#thing-1"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );
      internalStore.add(
        sym("http://pod.example/document#thing-2"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );
      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(2);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#thing-1",
      });
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#thing-2",
      });
    });

    it("return only one subject if there are multiple statements for it", () => {
      internalStore.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate1"),
        "literal value",
        sym("http://pod.example/document"),
      );
      internalStore.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate2"),
        "literal value",
        sym("http://pod.example/document"),
      );
      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(1);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#it",
      });
    });

    it("do not find subjects, that are not in the document", () => {
      internalStore.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/other-document"),
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });

    it("subjects do not include blank nodes", () => {
      internalStore.add(
        blankNode(),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });

    it("subjects do not include own document uri", () => {
      internalStore.add(
        sym("http://pod.example/document"),
        sym("http://vocab.test/title"),
        "document title",
        sym("http://pod.example/document"),
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });
  });
});
