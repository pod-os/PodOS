import { graph, IndexedFormula, quad, sym } from "rdflib";
import { PodOsSession } from "../authentication";
import { ContainerContent, LdpContainer } from "./LdpContainer";
import { Store } from "../Store";
import { Observable, Subscription } from "rxjs";

describe("LDP container", () => {
  describe("contains", () => {
    let internalStore: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let store: Store;

    beforeEach(() => {
      internalStore = graph();
      store = new Store(mockSession, undefined, undefined, internalStore);
    });

    it("contains nothing if store is empty", () => {
      const container = new LdpContainer("https://pod.test/container/", store);
      const result = container.contains();
      expect(result).toEqual([]);
    });

    it("contains a single file without types", () => {
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/"),
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
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/"),
      );
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/a/"),
        sym("https://pod.test/container/"),
      );

      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/b/"),
        sym("https://pod.test/container/"),
      );

      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/c/"),
        sym("https://pod.test/container/"),
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

  describe("observeContains", () => {
    jest.useFakeTimers();
    let internalStore: IndexedFormula,
      store: Store,
      subscriber: jest.Mock,
      subscription: Subscription,
      container: LdpContainer,
      observable: Observable<ContainerContent[]>;

    beforeEach(() => {
      internalStore = graph();
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file"),
        sym("https://pod.test/container/"),
      );
      store = new Store(
        {} as PodOsSession,
        undefined,
        undefined,
        internalStore,
      );
      subscriber = jest.fn();
      container = new LdpContainer("https://pod.test/container/", store);
      observable = container.observeContains();
      subscription = observable.subscribe(subscriber);
    });

    //To avoid memory leak
    afterEach(() => {
      subscription.unsubscribe();
    });

    it("pushes existing values immediately", () => {
      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([
        [
          [
            {
              uri: "https://pod.test/container/file",
              name: "file",
            },
          ],
        ],
      ]);
    });

    it("pushes new values once per group of changes until unsubcribe, ignoring irrelevant changes", () => {
      const containsSpy = jest.spyOn(container, "contains");
      internalStore.removeDocument(sym("https://pod.test/container/"));
      internalStore.addAll([
        quad(
          sym("https://pod.test/container/"),
          sym("http://www.w3.org/ns/ldp#contains"),
          sym("https://pod.test/container/file-1"),
          sym("https://pod.test/container/"),
        ),
        quad(
          sym("https://pod.test/container/"),
          sym("http://www.w3.org/ns/ldp#contains"),
          sym("https://pod.test/container/file-2"),
          sym("https://pod.test/container/"),
        ),
        quad(
          sym("http://recipe.test/2"),
          sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
          sym("http://recipe.test/RecipeClass"),
        ),
      ]);
      jest.advanceTimersByTime(255);
      // Note: subscriber counted initial push but containsSpy didn't
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(containsSpy).toHaveBeenCalledTimes(1);
      // Irrelevant as in another document
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/injected-file"),
        sym("https://pod.test/other-container/"),
      );
      // Irrelevant with different predicate
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
        sym("http://www.w3.org/ns/ldp#Container"),
        sym("https://pod.test/container/"),
      );
      jest.advanceTimersByTime(255);
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(containsSpy).toHaveBeenCalledTimes(1);
      expect(subscriber.mock.calls).toEqual([
        [
          [
            {
              uri: "https://pod.test/container/file",
              name: "file",
            },
          ],
        ],
        [
          [
            {
              uri: "https://pod.test/container/file-1",
              name: "file-1",
            },
            {
              uri: "https://pod.test/container/file-2",
              name: "file-2",
            },
          ],
        ],
      ]);

      // Stop listening to ignore future changes
      subscription.unsubscribe();
      internalStore.add(
        sym("https://pod.test/container/"),
        sym("http://www.w3.org/ns/ldp#contains"),
        sym("https://pod.test/container/file-ignored"),
        sym("https://pod.test/container/"),
      );
      expect(subscriber).toHaveBeenCalledTimes(2);
      expect(containsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
