import { graph, sym } from "rdflib";
import { RdfDocument } from "./RdfDocument";

describe("Document", () => {
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
  });
});
