import { graph, sym } from "rdflib";
import { Thing } from "./Thing";

describe("Thing", function () {
  describe("reverse relations", () => {
    it("are empty, if store is empty", () => {
      const store = graph();
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      expect(it.reverseRelations()).toEqual([]);
    });

    it("contains a single relation from store", () => {
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/resource"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          uris: ["https://pod.example/resource"],
        },
      ]);
    });

    it("contains multiple relations from store", () => {
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          uris: ["https://pod.example/first"],
        },
        {
          predicate: "http://vocab.test/second",
          uris: ["https://pod.example/second"],
        },
      ]);
    });

    it("contains multiple uris for a relation", () => {
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second"),
        sym("http://vocab.test/predicate"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/predicate",
          uris: ["https://pod.example/first", "https://pod.example/second"],
        },
      ]);
    });

    it("contains multiple relations and uris", () => {
      const store = graph();
      const uri = "https://jane.doe.example/container/file.ttl#fragment";
      store.add(
        sym("https://pod.example/first/1"),
        sym("http://vocab.test/first"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second/1"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/second/2"),
        sym("http://vocab.test/second"),
        sym(uri),
      );
      store.add(
        sym("https://pod.example/third/1"),
        sym("http://vocab.test/third"),
        sym(uri),
      );
      const it = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );
      const result = it.reverseRelations();
      expect(result).toEqual([
        {
          predicate: "http://vocab.test/first",
          uris: ["https://pod.example/first/1"],
        },
        {
          predicate: "http://vocab.test/second",
          uris: [
            "https://pod.example/second/1",
            "https://pod.example/second/2",
          ],
        },
        {
          predicate: "http://vocab.test/third",
          uris: ["https://pod.example/third/1"],
        },
      ]);
    });
  });
});
