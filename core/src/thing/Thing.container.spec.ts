import { graph, IndexedFormula } from "rdflib";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", () => {
  describe("container", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("returns the container for a thing", () => {
      // given a thing in a container
      const thing = new Thing(
        "https://pod.test/things/thing1",
        store,
        reactiveStore,
      );

      // when getting the container
      const container = thing.container();

      // then the container URI is returned
      expect(container.uri).toBe("https://pod.test/things/");
    });

    it("returns the container for a thing with fragment containing slash", () => {
      // given a thing with a URI that has a fragment containing a slash
      const thing = new Thing(
        "https://pod.test/things/thing1#path/to/fragment",
        store,
        reactiveStore,
      );

      // when getting the container
      const container = thing.container();

      // then the container URI is returned without the fragment
      expect(container.uri).toBe("https://pod.test/things/");
    });

    it("returns the container for a thing that is a document", () => {
      // given a thing with that is a document
      const thing = new Thing(
        "https://pod.test/things/thing1",
        store,
        reactiveStore,
      );

      // when getting the container
      const container = thing.container();

      // then the container URI is returned
      expect(container.uri).toBe("https://pod.test/things/");
    });

    it("returns the parent container for a thing that is itself a container", () => {
      // given a thing with that is a container
      const thing = new Thing(
        "https://pod.test/things/thing1/",
        store,
        reactiveStore,
      );

      // when getting the container
      const container = thing.container();

      // then the container URI is returned
      expect(container.uri).toBe("https://pod.test/things/");
    });
  });
});
