import { blankNode, graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { RdfDocument } from "./RdfDocument";
import { Store } from "../Store";

describe("RdfDocument", () => {
  describe("subjects", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("does not find any subjects if store is empty", () => {
      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(0);
    });

    it("returns single subject if available", () => {
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );

      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(1);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#it",
      });
    });

    it("return all subjects that are found", () => {
      store.add(
        sym("http://pod.example/document#thing-1"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );
      store.add(
        sym("http://pod.example/document#thing-2"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );
      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(2);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#thing-1",
      });
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#thing-2",
      });
    });

    it("return only one subject if there are multiple statements for it", () => {
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate1"),
        "literal value",
        sym("http://pod.example/document"),
      );
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate2"),
        "literal value",
        sym("http://pod.example/document"),
      );
      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(1);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#it",
      });
    });

    it("do not find subjects, that are not in the document", () => {
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/other-document"),
      );

      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(0);
    });

    it("subjects do not include blank nodes", () => {
      store.add(
        blankNode(),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document"),
      );

      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(0);
    });

    it("subjects do not include own document uri", () => {
      store.add(
        sym("http://pod.example/document"),
        sym("http://vocab.test/title"),
        "document title",
        sym("http://pod.example/document"),
      );

      const document = new RdfDocument(
        "http://pod.example/document",
        store,
        reactiveStore,
      );

      expect(document.subjects()).toHaveLength(0);
    });
  });
});
