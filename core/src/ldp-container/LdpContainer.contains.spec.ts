import { graph, IndexedFormula, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { LdpContainer } from "./LdpContainer";
import { Store } from "../Store";

describe("LDP container", () => {
  describe("contains", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("contains nothing if store is empty", () => {
      const container = new LdpContainer(
        "https://pod.test/container/",
        store,
        reactiveStore,
      );
      const result = container.contains();
      expect(result).toEqual([]);
    });

    it("contains a single file without types", () => {
      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/"),
      );
      const container = new LdpContainer(
        "https://pod.test/container/",
        store,
        reactiveStore,
      );
      const result = container.contains();
      expect(result).toEqual([
        {
          uri: "https://pod.test/container/file",
          name: "file",
        },
      ]);
    });

    it("contains multiple files / containers", () => {
      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/"),
      );
      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/a/"),
        sym("https://pod.test/container/"),
      );

      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/b/"),
        sym("https://pod.test/container/"),
      );

      store.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/c/"),
        sym("https://pod.test/container/"),
      );
      const container = new LdpContainer(
        "https://pod.test/container/",
        store,
        reactiveStore,
      );
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
