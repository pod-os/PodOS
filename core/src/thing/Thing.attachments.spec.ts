import { graph, sym } from "rdflib";
import { Thing } from "./Thing";

describe("Thing", function () {
  describe("attachments", () => {
    it("returns empty list if store is empty", () => {
      // Given: a Thing with an empty store
      const store = graph();
      const thing = new Thing(
        "https://jane.doe.example/container/file.ttl#fragment",
        store,
      );

      // When: we call attachments()
      const result = thing.attachments();

      // Then: it should return an empty array
      expect(result).toEqual([]);
    });

    it("returns attachments with label and uri", () => {
      // Given: a Thing with a store containing attachment data
      const store = graph();
      const thingUri = "https://jane.doe.example/container/file.ttl#fragment";
      const attachmentUri = "https://jane.doe.example/attachments/document.pdf";

      store.add(
        sym(thingUri),
        sym("http://www.w3.org/2005/01/wf/flow#attachment"),
        sym(attachmentUri),
      );

      const thing = new Thing(thingUri, store);

      // When: we call attachments()
      const result = thing.attachments();

      // Then: it should return an array with the attachment object containing uri and label
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        uri: attachmentUri,
        label: "document.pdf",
      });
    });
  });
});
