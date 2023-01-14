import { graph, sym } from "rdflib";
import { LdpContainer } from "./LdpContainer";

describe("LDP container", () => {
  describe("contains", () => {
    it("contains nothing if store is empty", () => {
      const container = new LdpContainer(
        "https://pod.test/container/",
        graph()
      );
      const result = container.contains();
      expect(result).toEqual([]);
    });

    it("contains a single file without types", () => {
      let store = graph();
      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/")
      );
      const container = new LdpContainer("https://pod.test/container/", store);
      const result = container.contains();
      expect(result).toEqual([
        {
          uri: "https://pod.test/container/file",
          name: "file",
        },
      ]);
    });

    it("contains multiple files / containers", () => {
      let store = graph();
      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/")
      );
      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/a/"),
        sym("https://pod.test/container/")
      );

      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/b/"),
        sym("https://pod.test/container/")
      );

      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/c/"),
        sym("https://pod.test/container/")
      );
      const container = new LdpContainer("https://pod.test/container/", store);
      const result = container.contains();
      expect(result).toEqual([
        {
          uri: "https://pod.test/container/file",
          name: "file",
        },
        {
          uri: "https://pod.test/container/a/",
          name: "a",
        },
        {
          uri: "https://pod.test/container/b/",
          name: "b",
        },
        {
          uri: "https://pod.test/container/c/",
          name: "c",
        },
      ]);
    });
  });
});
