import { graph } from "rdflib";
import { ok } from "neverthrow";
import { PictureGateway } from "./PictureGateway";
import { Store } from "../Store";
import { FileFetcher } from "../files/FileFetcher";
import { Thing } from "../thing";

describe("PictureGateway", () => {
  describe("uploadAndAddPicture", () => {
    it("uploads the given file to the things container", async () => {
      // given a thing in a container
      const store = graph();
      const thing = new Thing("https://pod.test/things/thing1", store, true);

      // and a picture file to upload
      const pictureFile = new Blob(["picture data"], { type: "image/png" });

      // and a file fetcher that can create files
      const fileFetcher = {
        createNewFile: jest.fn().mockReturnValue(
          ok({
            url: "https://pod.test/things/picture.png",
            name: "picture.png",
            contentType: "image/png",
          }),
        ),
      } as unknown as FileFetcher;

      // when uploading and adding the picture
      const gateway = new PictureGateway(mockStore(), fileFetcher);
      const result = await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the file is uploaded to the things container
      expect(fileFetcher.createNewFile).toHaveBeenCalledWith(
        expect.objectContaining({
          uri: "https://pod.test/things/",
        }),
        expect.any(String),
      );
    });
  });

  function mockStore() {
    return {
      fetcher: {
        load: jest.fn(),
      },
      updater: {
        update: jest.fn(),
      },
    } as unknown as Store;
  }
});
