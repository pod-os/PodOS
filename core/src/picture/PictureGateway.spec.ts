import { graph } from "rdflib";
import { ok } from "neverthrow";
import { PictureGateway } from "./PictureGateway";
import { Store } from "../Store";
import { FileFetcher } from "../files/FileFetcher";
import { Thing } from "../thing";

describe("PictureGateway", () => {
  let gateway: PictureGateway;
  let fileFetcher: jest.Mocked<FileFetcher>;
  let thing: Thing;

  beforeEach(() => {
    // given a thing in a container
    const store = graph();
    thing = new Thing("https://pod.test/things/thing1", store, true);

    // and a file fetcher that can create files
    fileFetcher = createMockFileFetcher();

    // and a picture gateway
    gateway = new PictureGateway(createMockStore(), fileFetcher);
  });

  describe("uploadAndAddPicture", () => {
    it("uploads the file including its content", async () => {
      // given a picture file with binary content
      const pictureFile = new File(["picture binary data"], "photo.jpg", {
        type: "image/jpeg",
      });

      // when uploading and adding the picture
      await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the file object with content is passed to createNewFile
      expect(fileFetcher.createNewFile).toHaveBeenCalledWith(
        expect.objectContaining({
          uri: "https://pod.test/things/",
        }),
        pictureFile,
      );
    });
  });

  function createMockFileFetcher(): jest.Mocked<FileFetcher> {
    return {
      createNewFile: jest.fn().mockReturnValue(
        ok({
          url: "https://pod.test/things/picture.png",
          name: "my-picture.png",
          contentType: "image/png",
        }),
      ),
    } as unknown as jest.Mocked<FileFetcher>;
  }

  function createMockStore(): Store {
    const store = graph();
    return {
      fetcher: {
        load: jest.fn(),
      },
      updater: {
        update: jest.fn(),
      },
      get: jest.fn((uri: string) => new Thing(uri, store, true)),
    } as unknown as Store;
  }
});
