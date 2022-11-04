import { blankNode, graph, sym } from "rdflib";
import { RdfDocument } from "./RdfDocument";

describe("RdfDocument", () => {
  describe("subjects", () => {
    it("does not find any subjects if store is empty", () => {
      const store = graph();
      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });

    it("returns single subject if available", () => {
      const store = graph();
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document")
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(1);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#it",
      });
    });

    it("return all subjects that are found", () => {
      const store = graph();
      store.add(
        sym("http://pod.example/document#thing-1"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document")
      );
      store.add(
        sym("http://pod.example/document#thing-2"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document")
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
      const store = graph();
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate1"),
        "literal value",
        sym("http://pod.example/document")
      );
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate2"),
        "literal value",
        sym("http://pod.example/document")
      );
      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(1);
      expect(document.subjects()).toContainEqual({
        uri: "http://pod.example/document#it",
      });
    });

    it("do not find subjects, that are not in the document", () => {
      const store = graph();
      store.add(
        sym("http://pod.example/document#it"),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/other-document")
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });

    it("subjects do not include blank nodes", () => {
      const store = graph();
      store.add(
        blankNode(),
        sym("http://vocab.test/predicate"),
        "literal value",
        sym("http://pod.example/document")
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });

    it("subjects do not include own document uri", () => {
      const store = graph();
      store.add(
        sym("http://pod.example/document"),
        sym("http://vocab.test/title"),
        "document title",
        sym("http://pod.example/document")
      );

      const document = new RdfDocument("http://pod.example/document", store);

      expect(document.subjects()).toHaveLength(0);
    });
  });
});
