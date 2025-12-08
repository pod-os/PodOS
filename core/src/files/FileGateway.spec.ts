import { graph } from "rdflib";
import { err, ok } from "neverthrow";
import { FileGateway } from "./FileGateway";
import { Store } from "../Store";
import { FileFetcher } from "../files/FileFetcher";
import { Thing } from "../thing";

describe("PictureGateway", () => {
  let gateway: FileGateway;
  let fileFetcher: jest.Mocked<FileFetcher>;
  let thing: Thing;
  let mockStore: Store;

  beforeEach(() => {
    // given a thing in a container
    const store = graph();
    thing = new Thing("https://pod.test/things/thing1", store, true);

    // and a file fetcher that can create files
    fileFetcher = createMockFileFetcher();

    // and a mock store
    mockStore = createMockStore();

    // and a picture gateway
    gateway = new FileGateway(mockStore, fileFetcher);
  });

  describe("uploadAndAddPicture", () => {
    it("uploads the file including its content", async () => {
      // given a picture file with binary content
      const pictureFile = createPictureFile("photo.jpg", "picture binary data");

      // when uploading and adding the picture
      await gateway.uploadAndLinkFile(
        thing,
        "http://schema.org/image",
        pictureFile,
      );

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
      const pictureFile = createPictureFile("vacation.jpg");

      // and the file fetcher will return the created file metadata
      const fileMetadata = {
        url: "https://pod.test/things/vacation.jpg",
        name: "vacation.jpg",
        contentType: "image/jpeg",
      };
      fileFetcher.createNewFile.mockReturnValue(
        ok(fileMetadata) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // when uploading and adding the picture
      const result = await gateway.uploadAndLinkFile(
        thing,
        "http://schema.org/image",
        pictureFile,
      );

      // then the result contains all file metadata
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap()).toEqual(fileMetadata);
    });

    it("returns an error when file creation fails", async () => {
      // given a picture file to upload
      const pictureFile = createPictureFile("photo.jpg");

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
      const result = await gateway.uploadAndLinkFile(
        thing,
        "http://schema.org/image",
        pictureFile,
      );

      // then the result contains the error
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual(httpError);
    });

    it("adds the uploaded image URL to the thing as schema:image", async () => {
      // given a picture file to upload
      const pictureFile = createPictureFile("sunset.jpg");

      // and the file fetcher will create the file at a specific URL
      fileFetcher.createNewFile.mockReturnValue(
        ok({
          url: "https://pod.test/things/sunset.jpg",
          name: "sunset.jpg",
          contentType: "image/jpeg",
        }) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // and we track store update operations
      const mockExecuteUpdate = jest.fn().mockResolvedValue(undefined);
      mockStore.executeUpdate = mockExecuteUpdate;

      // when uploading and adding the picture
      await gateway.uploadAndLinkFile(
        thing,
        "http://schema.org/image",
        pictureFile,
      );

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

    it("returns a network error when linking the picture to the thing fails", async () => {
      // given a picture file to upload
      const pictureFile = createPictureFile("photo.jpg");

      // and the file creation succeeds
      fileFetcher.createNewFile.mockReturnValue(
        ok({
          url: "https://pod.test/things/photo.jpg",
          name: "photo.jpg",
          contentType: "image/jpeg",
        }) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // and the store update will fail
      mockStore.executeUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Network failure"));

      // when uploading and adding the picture
      const result = await gateway.uploadAndLinkFile(
        thing,
        "http://schema.org/image",
        pictureFile,
      );

      // then the result contains a network error
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual({
        type: "network",
        title: "Failed to link file to thing",
      });
    });
  });

  function createPictureFile(filename: string, content: string = "data"): File {
    return new File([content], filename, {
      type: "image/jpeg",
    });
  }

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
