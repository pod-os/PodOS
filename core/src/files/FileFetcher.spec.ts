import { when } from "jest-when";
import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { FileFetcher } from "./FileFetcher";

describe("FileFetcher", () => {
  describe("fetch file", () => {
    it("fetches image blob", async () => {
      // given a png blob
      const pngBlob = new Blob(["1"], {
        type: "image/png",
      });

      // and a session
      const session = mockSession();

      // and an authenticated fetch for an image url returns the blob
      when(session.authenticatedFetch)
        .calledWith("https://pod.test/image.png")
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
          headers: new Headers({
            "Content-Type": "image/png",
          }),
          blob: () => Promise.resolve(pngBlob),
        } as Response);

      // when fetching a file for that url with the file fetcher
      const file = await new FileFetcher(session).fetchFile(
        "https://pod.test/image.png",
      );
      // then the returned file contains the blob
      expect(file).toBeInstanceOf(BinaryFile);
      expect(file.blob()).toEqual(pngBlob);
      // and the url
      expect(file.url).toEqual("https://pod.test/image.png");
    });

    it("returns broken file when fetching failed", async () => {
      // given a session
      const session = mockSession();

      // and an authenticated fetch for an image url returns a http error code
      when(session.authenticatedFetch)
        .calledWith("https://pod.test/image.png")
        .mockResolvedValue({
          ok: false,
          status: 404,
          statusText: "Not Found",
          headers: new Headers({
            "Content-Type": "text/plain",
          }),
        } as Response);

      // when fetching a blob for that url with the file fetcher
      const file = await new FileFetcher(session).fetchFile(
        "https://pod.test/image.png",
      );

      // then the returned file is broken
      expect(file).toBeInstanceOf(BrokenFile);
      expect(file.toString()).toBe(
        "404 - Not Found - https://pod.test/image.png",
      );
      // and the url is present
      expect(file.url).toEqual("https://pod.test/image.png");
    });
  });

  describe("put file", () => {
    let fileFetcher: FileFetcher;
    let session: PodOsSession;
    beforeEach(() => {
      // given a session
      session = mockSession();
      // and a file fetcher
      fileFetcher = new FileFetcher(session);
      // and PUT usually works
      when(session.authenticatedFetch)
        .calledWith(expect.anything(), expect.anything())
        .mockResolvedValue({
          ok: true,
          status: 200,
          statusText: "OK",
        } as Response);
    });

    it("puts a markdown file", async () => {
      // given a markdown file
      const file = markdownFile();

      // when updating the content of the file
      const result = await fileFetcher.putFile(file, "new content");

      // then the file has been put
      expect(session.authenticatedFetch).toHaveBeenCalledWith(
        file.url,
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "text/markdown",
          },
          body: "new content",
        }),
      );

      // and the response is given
      expect(result).toEqual({
        ok: true,
        status: 200,
        statusText: "OK",
      } as Response);
    });

    it("puts a plain text file if no old content is known", async () => {
      // given a file without a blob
      const file = {
        url: "https://pod.test/file.md",
        blob: () => null,
      };

      // when updating the content of the file
      await fileFetcher.putFile(file, "new content");

      // then the file has been put as plain text
      expect(session.authenticatedFetch).toHaveBeenCalledWith(
        file.url,
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "text/plain",
          },
          body: "new content",
        }),
      );
    });

    it("returns the http error response if fetch fails", async () => {
      // given a markdown file
      const file = markdownFile();

      // and PUT fails with an error
      when(session.authenticatedFetch)
        .calledWith(expect.anything(), expect.anything())
        .mockResolvedValue({
          ok: false,
          status: 403,
          statusText: "Forbidden",
        } as Response);

      // when updating the content of the file
      const result = await fileFetcher.putFile(file, "new content");

      // then the error response is returned
      expect(result).toEqual({
        ok: false,
        status: 403,
        statusText: "Forbidden",
      } as Response);
    });
  });

  function mockSession() {
    return {
      authenticatedFetch: jest.fn(),
    } as unknown as PodOsSession;
  }

  function markdownFile() {
    return {
      url: "https://pod.test/file.md",
      blob: () =>
        new Blob(["1"], {
          type: "text/markdown",
        }),
    };
  }
});
