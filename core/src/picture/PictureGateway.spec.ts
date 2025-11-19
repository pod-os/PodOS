import { graph } from "rdflib";
import { ok, err } from "neverthrow";
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

    it("returns the created file with all metadata", async () => {
      // given a picture file to upload
      const pictureFile = new File(["data"], "vacation.jpg", {
        type: "image/jpeg",
      });

      // and the file fetcher will return the created file metadata
      fileFetcher.createNewFile.mockReturnValue(
        ok({
          url: "https://pod.test/things/vacation.jpg",
          name: "vacation.jpg",
          contentType: "image/jpeg",
        }) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // when uploading and adding the picture
      const result = await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the result contains all file metadata
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual({
        url: "https://pod.test/things/vacation.jpg",
        name: "vacation.jpg",
        contentType: "image/jpeg",
      });
    });

    it("returns an error when file creation fails", async () => {
      // given a picture file to upload
      const pictureFile = new File(["data"], "photo.jpg", {
        type: "image/jpeg",
      });

      // and the file creation will fail with an HTTP error
      const httpError = {
        type: "http" as const,
        status: 403,
        title: "Upload forbidden",
        detail: "The server responded with 403 Forbidden",
      };
      fileFetcher.createNewFile.mockReturnValue(
        err(httpError) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // when uploading and adding the picture
      const result = await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the result contains the error
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual(httpError);
    });

    it("adds the uploaded image URL to the thing as schema:image", async () => {
      // given a picture file to upload
      const pictureFile = new File(["data"], "sunset.jpg", {
        type: "image/jpeg",
      });

      // and the file fetcher will create the file at a specific URL
      fileFetcher.createNewFile.mockReturnValue(
        ok({
          url: "https://pod.test/things/sunset.jpg",
          name: "sunset.jpg",
          contentType: "image/jpeg",
        }) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // and a mock store that tracks update operations
      const mockStore = createMockStore();
      const mockExecuteUpdate = jest.fn().mockResolvedValue(undefined);
      mockStore.executeUpdate = mockExecuteUpdate;
      const gatewayWithMockStore = new PictureGateway(mockStore, fileFetcher);

      // when uploading and adding the picture
      await gatewayWithMockStore.uploadAndAddPicture(thing, pictureFile);

      // then the store is updated with schema:image pointing to the file URL
      expect(mockExecuteUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          insertions: expect.arrayContaining([
            expect.objectContaining({
              subject: expect.objectContaining({
                value: "https://pod.test/things/thing1",
              }),
              predicate: expect.objectContaining({
                value: "http://schema.org/image",
              }),
              object: expect.objectContaining({
                value: "https://pod.test/things/sunset.jpg",
              }),
            }),
          ]),
        }),
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
      executeUpdate: jest.fn().mockResolvedValue(undefined),
    } as unknown as Store;
  }
});
