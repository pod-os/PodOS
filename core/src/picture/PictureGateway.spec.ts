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
  let pictureFile: Blob;

  beforeEach(() => {
    // given a thing in a container
    const store = graph();
    thing = new Thing("https://pod.test/things/thing1", store, true);

    // and a picture file to upload
    pictureFile = new Blob(["picture data"], { type: "image/png" });

    // and a file fetcher that can create files
    fileFetcher = {
      createNewFile: jest.fn().mockReturnValue(
        ok({
          url: "https://pod.test/things/picture.png",
          name: "picture.png",
          contentType: "image/png",
        }),
      ),
    } as unknown as jest.Mocked<FileFetcher>;

    // and a picture gateway
    gateway = new PictureGateway(mockStore(), fileFetcher);
  });

  describe("uploadAndAddPicture", () => {
    it("uploads the given file to the things container", async () => {
      // when uploading and adding the picture
      await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the file is uploaded to the things container
      expect(fileFetcher.createNewFile).toHaveBeenCalledWith(
        expect.objectContaining({
          uri: "https://pod.test/things/",
        }),
        expect.any(String),
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
