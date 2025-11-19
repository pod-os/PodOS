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
    fileFetcher = {
      createNewFile: jest.fn().mockReturnValue(
        ok({
          url: "https://pod.test/things/picture.png",
          name: "my-picture.png",
          contentType: "image/png",
        }),
      ),
    } as unknown as jest.Mocked<FileFetcher>;

    // and a picture gateway
    gateway = new PictureGateway(mockStore(), fileFetcher);
  });

  describe("uploadAndAddPicture", () => {
    it("uploads the file including its content", async () => {
      // given a picture file with specific content
      const fileContent = "picture binary data";
      const pictureWithContent = new File([fileContent], "photo.jpg", {
        type: "image/jpeg",
      });

      // when uploading and adding the picture
      await gateway.uploadAndAddPicture(thing, pictureWithContent);

      // then the file object with content is passed to createNewFile
      expect(fileFetcher.createNewFile).toHaveBeenCalledWith(
        expect.objectContaining({
          uri: "https://pod.test/things/",
        }),
        pictureWithContent,
      );
    });
  });
});

function mockStore(): Store {
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
