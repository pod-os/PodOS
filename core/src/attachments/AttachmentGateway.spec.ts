import { graph } from "rdflib";
import { ok } from "neverthrow";
import { AttachmentGateway } from "./AttachmentGateway";
import { Thing } from "../thing";
import { FileGateway } from "../files";

describe("AttachmentGateway", () => {
  let gateway: AttachmentGateway;
  let fileGateway: jest.Mocked<FileGateway>;
  let thing: Thing;

  beforeEach(() => {
    // given a thing in a container
    const store = graph();
    thing = new Thing("https://pod.test/things/thing1", store, true);

    // and a file gateway
    fileGateway = createMockFileGateway();

    // and an attachment gateway
    gateway = new AttachmentGateway(fileGateway);
  });

  describe("uploadAndAddAttachment", () => {
    it("uploads the file with flow:attachment predicate", async () => {
      // given an attachment file
      const attachmentFile = createAttachmentFile("document.pdf");

      // when uploading and adding the attachment
      await gateway.uploadAndAddAttachment(thing, attachmentFile);

      // then the file is passed to uploadAndLinkFile with flow:attachment predicate
      expect(fileGateway.uploadAndLinkFile).toHaveBeenCalledWith(
        thing,
        "http://www.w3.org/2005/01/wf/flow#attachment",
        attachmentFile,
      );
    });
  });

  function createAttachmentFile(
    filename: string,
    content: string = "data",
  ): File {
    return new File([content], filename, {
      type: "application/octet-stream",
    });
  }

  function createMockFileGateway(): jest.Mocked<FileGateway> {
    return {
      uploadAndLinkFile: jest.fn().mockReturnValue(
        ok({
          url: "https://pod.test/things/document.pdf",
          name: "document.pdf",
          contentType: "application/pdf",
        }),
      ),
    } as unknown as jest.Mocked<FileGateway>;
  }
});
