import { blankNode, graph, IndexedFormula, sym } from "rdflib";
import { flow } from "../namespaces";
import { PodOsSession } from "../authentication";
import { Thing } from "./Thing";
import { Store } from "../Store";

describe("Thing", function () {
  describe("attachments", () => {
    let store: IndexedFormula;
    const mockSession = {} as unknown as PodOsSession;
    let reactiveStore: Store;

    beforeEach(() => {
      store = graph();
      reactiveStore = new Store(mockSession, undefined, undefined, store);
    });

    it("returns empty list if store is empty", () => {
      // Given: a Thing with an empty store
      const thing = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
        reactiveStore,
      );

      // When: we call attachments()
      const result = thing.attachments();

      // Then: it should return an empty array
      expect(result).toEqual([]);
    });

    it("returns attachments with label and uri", () => {
      // Given: a Thing with a store containing attachment data
      const thingUri = "https://jane.doe.example/container/file.ttl#fragment";
      const attachmentUri = "https://jane.doe.example/attachments/document.pdf";

      store.add(sym(thingUri), flow("attachment"), sym(attachmentUri));

      const thing = new Thing(thingUri, store, reactiveStore);

      // When: we call attachments()
      const result = thing.attachments();

      // Then: it should return an array with the attachment object containing uri and label
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        uri: attachmentUri,
        label: "document.pdf",
      });
    });

    it("ignores blank nodes as attachments", () => {
      // Given: a Thing with a store containing a blank node attachment
      const thingUri = "https://jane.doe.example/container/file.ttl#fragment";

      store.add(sym(thingUri), flow("attachment"), blankNode("blank"));

      const thing = new Thing(thingUri, store, reactiveStore);

      // When: we call attachments()
      const result = thing.attachments();

      // Then: it should return an empty array (blank nodes are not valid attachments)
      expect(result).toEqual([]);
    });

    it("ignores literals as attachments", () => {
      // Given: a Thing with a store containing a literal attachment
      const thingUri = "https://jane.doe.example/container/file.ttl#fragment";

      store.add(sym(thingUri), flow("attachment"), "literal value");

      const thing = new Thing(thingUri, store, reactiveStore);

      // When: we call attachments()
      const result = thing.attachments();

      // Then: it should return an empty array (literals are not valid attachments)
      expect(result).toEqual([]);
    });
  });
});
