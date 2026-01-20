import { graph } from "rdflib";
import { err, ok } from "neverthrow";
import { PodOsSession } from "../authentication";
import { PictureGateway } from "./PictureGateway";
import { FileFetcher } from "../files/FileFetcher";
import { Store } from "../Store";
import { Thing } from "../thing";
import { FileGateway } from "../files/FileGateway";

describe("PictureGateway", () => {
  let gateway: PictureGateway;
  let attachmentGateway: jest.Mocked<FileGateway>;
  let thing: Thing;

  beforeEach(() => {
    // given a thing in a container

    const store = graph();
    const mockSession = {} as unknown as PodOsSession;
    const reactiveStore = new Store(mockSession, undefined, undefined, store);

    thing = new Thing(
      "https://pod.test/things/thing1",
      store,
      reactiveStore,
      true,
    );

    // and an attachment gateway
    attachmentGateway = createMockAttachmentGateway();

    // and a picture gateway
    gateway = new PictureGateway(attachmentGateway);
  });

  describe("uploadAndAddPicture", () => {
    it("uploads the file including its content", async () => {
      // given a picture file with binary content
      const pictureFile = createPictureFile("photo.jpg", "picture binary data");

      // when uploading and adding the picture
      await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the file object with content is passed to uploadAndAddFile
      expect(attachmentGateway.uploadAndLinkFile).toHaveBeenCalledWith(
        thing,
        "http://schema.org/image",
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
      attachmentGateway.uploadAndLinkFile.mockReturnValue(
        ok(fileMetadata) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // when uploading and adding the picture
      const result = await gateway.uploadAndAddPicture(thing, pictureFile);

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
      attachmentGateway.uploadAndLinkFile.mockReturnValue(
        err(httpError) as unknown as ReturnType<FileFetcher["createNewFile"]>,
      );

      // when uploading and adding the picture
      const result = await gateway.uploadAndAddPicture(thing, pictureFile);

      // then the result contains the error
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toEqual(httpError);
    });
  });

  function createPictureFile(filename: string, content: string = "data"): File {
    return new File([content], filename, {
      type: "image/jpeg",
    });
  }

  function createMockAttachmentGateway(): jest.Mocked<FileGateway> {
    return {
      uploadAndLinkFile: jest.fn().mockReturnValue(
        ok({
          url: "https://pod.test/things/picture.png",
          name: "my-picture.png",
          contentType: "image/png",
        }),
      ),
    } as unknown as jest.Mocked<FileGateway>;
  }
});
