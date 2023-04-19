import { Store } from "../Store";
import { UriService } from "./UriService";

describe("UriService", () => {
  describe("propose uri for new thing", () => {
    it("uses the container if the reference uri is a container", () => {
      const store = { isContainer: () => true } as unknown as Store;

      const uriService = new UriService(store);

      const result = uriService.proposeUriForNewThing(
        "https://pod.test/container/",
        "A new thing"
      );

      expect(result).toBe("https://pod.test/container/a-new-thing#it");
    });

    it("uses the file's container if the reference uri is a file", () => {
      const store = { isContainer: () => false } as unknown as Store;

      const uriService = new UriService(store);

      const result = uriService.proposeUriForNewThing(
        "https://pod.test/container/file",
        "A new thing"
      );

      expect(result).toBe("https://pod.test/container/a-new-thing#it");
    });

    it("uses the resource container for a non-information resource", () => {
      const store = { isContainer: () => false } as unknown as Store;

      const uriService = new UriService(store);

      const result = uriService.proposeUriForNewThing(
        "https://pod.test/container/file#it",
        "A new thing"
      );

      expect(result).toBe("https://pod.test/container/a-new-thing#it");
    });
  });
});
