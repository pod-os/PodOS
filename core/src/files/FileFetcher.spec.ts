import { when } from "jest-when";
import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { FileFetcher } from "./FileFetcher";
import { LdpContainer } from "../ldp-container";
import { Store } from "../Store";
import { graph, IndexedFormula } from "rdflib";

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

  describe("create new container", () => {
    describe("if successful", () => {
      let fileFetcher: FileFetcher;
      let session: PodOsSession;
      let internalStore: IndexedFormula;
      let store: Store;

      beforeEach(() => {
        // given a session
        session = mockSession();
        // and a store
        internalStore = graph();
        store = new Store(session, undefined, undefined, internalStore);
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

      it("creates a new container using PUT request and returns it", async () => {
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        const result = await fileFetcher.createNewFolder(parent, "sub-folder");
        expect(session.authenticatedFetch).toHaveBeenCalledWith(
          "https://pod.test/parent/sub-folder/",
          expect.objectContaining({
            method: "PUT",
          }),
        );
        expect(result.isOk()).toBe(true);
        expect(result._unsafeUnwrap()).toEqual({
          url: "https://pod.test/parent/sub-folder/",
          name: "sub-folder",
        });
      });

      it("encodes name as URI", async () => {
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        await fileFetcher.createNewFolder(parent, "My (new?) / <folder>!");
        expect(session.authenticatedFetch).toHaveBeenCalledWith(
          "https://pod.test/parent/My%20(new%3F)%20%2F%20%3Cfolder%3E!/",
          expect.objectContaining({
            method: "PUT",
          }),
        );
      });
    });

    describe("if it fails", () => {
      let fileFetcher: FileFetcher;
      let session: PodOsSession;
      let internalStore: IndexedFormula;
      let store: Store;
      beforeEach(() => {
        // given a session
        session = mockSession();
        // and a store
        internalStore = graph();
        store = new Store(session, undefined, undefined, internalStore);
        // and a file fetcher
        fileFetcher = new FileFetcher(session);
      });

      it("returns error result on bad http status codes", async () => {
        // and PUT responds with http error code
        const httpResponse = {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        } as Response;
        when(session.authenticatedFetch)
          .calledWith(expect.anything(), expect.anything())
          .mockResolvedValue(httpResponse);
        // when a new file is created
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        const result = await fileFetcher.createNewFolder(parent, "my-folder");
        // then the result is an http error
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr()).toEqual({
          type: "http",
          status: 401,
          title: "The folder could not be created",
          detail: "The server responded with 401 Unauthorized",
        });
      });

      it("returns error result if fetch is rejected with an error", async () => {
        // and PUT fails with an error
        when(session.authenticatedFetch)
          .calledWith(expect.anything(), expect.anything())
          .mockRejectedValue(new Error("Network Error"));
        // when a new file is created
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        const result = await fileFetcher.createNewFolder(parent, "my-folder");
        // then the result is a network error
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr()).toEqual({
          type: "network",
          title: "The folder could not be created",
          detail: "The server could not be reached: Network Error",
        });
      });
    });
  });

  describe("create new file", () => {
    describe("if successful", () => {
      let fileFetcher: FileFetcher;
      let session: PodOsSession;
      let internalStore: IndexedFormula;
      let store: Store;
      beforeEach(() => {
        // given a session
        session = mockSession();
        // and a store
        internalStore = graph();
        store = new Store(session, undefined, undefined, internalStore);
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

      it("creates a new turtle file by default and returns it", async () => {
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        const result = await fileFetcher.createNewFile(parent, "my-file");
        expect(session.authenticatedFetch).toHaveBeenCalledWith(
          "https://pod.test/parent/my-file",
          expect.objectContaining({
            method: "PUT",
            headers: {
              "Content-Type": "text/turtle",
              "If-None-Match": "*",
            },
          }),
        );
        expect(result.isOk()).toBe(true);
        const newFIle = result._unsafeUnwrap();
        expect(newFIle).toEqual({
          url: "https://pod.test/parent/my-file",
          name: "my-file",
          contentType: "text/turtle",
        });
      });

      it.each([
        {
          extension: ".ttl",
          contentType: "text/turtle",
        },
        {
          extension: ".md",
          contentType: "text/markdown",
        },
        {
          extension: ".txt",
          contentType: "text/plain",
        },
        {
          extension: ".png",
          contentType: "image/png",
        },
        {
          extension: ".pdf",
          contentType: "application/pdf",
        },
      ])(
        "uses content type $contentType for file with extension $extension",
        async ({ extension, contentType }) => {
          const parent = new LdpContainer(
            "https://pod.test/parent/",
            store,
            true,
          );
          const name = `file${extension}`;
          const result = await fileFetcher.createNewFile(parent, name);
          expect(session.authenticatedFetch).toHaveBeenCalledWith(
            `https://pod.test/parent/${name}`,
            expect.objectContaining({
              method: "PUT",
              headers: {
                "Content-Type": contentType,
                "If-None-Match": "*",
              },
            }),
          );
          expect(result.isOk()).toBe(true);
          const newFIle = result._unsafeUnwrap();
          expect(newFIle).toEqual({
            url: `https://pod.test/parent/${name}`,
            name,
            contentType,
          });
        },
      );

      it("encodes name as URI", async () => {
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        await fileFetcher.createNewFile(parent, "My (new?) / <file>!");
        expect(session.authenticatedFetch).toHaveBeenCalledWith(
          "https://pod.test/parent/My%20(new%3F)%20%2F%20%3Cfile%3E!",
          expect.objectContaining({
            method: "PUT",
            headers: {
              "Content-Type": "text/turtle",
              "If-None-Match": "*",
            },
          }),
        );
      });

      it("creates a new file given a File instance", async () => {
        // given a parent container
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );

        // and a File instance to upload
        const file = new File(["picture data"], "photo.png", {
          type: "image/png",
        });

        // when creating a new file with the File instance
        const result = await fileFetcher.createNewFile(parent, file);

        // then the file content is uploaded
        expect(session.authenticatedFetch).toHaveBeenCalledWith(
          "https://pod.test/parent/photo.png",
          expect.objectContaining({
            method: "PUT",
            headers: {
              "Content-Type": "image/png",
              "If-None-Match": "*",
            },
            body: file,
          }),
        );

        // and the result contains the uploaded file information
        expect(result.isOk()).toBe(true);
        const newFile = result._unsafeUnwrap();
        expect(newFile).toEqual({
          url: "https://pod.test/parent/photo.png",
          name: "photo.png",
          contentType: "image/png",
        });
      });
    });

    describe("if it fails", () => {
      let fileFetcher: FileFetcher;
      let session: PodOsSession;
      let internalStore: IndexedFormula;
      let store: Store;
      beforeEach(() => {
        // given a session
        session = mockSession();
        // and a store
        internalStore = graph();
        store = new Store(session, undefined, undefined, internalStore);
        // and a file fetcher
        fileFetcher = new FileFetcher(session);
      });

      it("returns error result on bad http status codes", async () => {
        // and PUT responds with http error code
        const httpResponse = {
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        } as Response;
        when(session.authenticatedFetch)
          .calledWith(expect.anything(), expect.anything())
          .mockResolvedValue(httpResponse);
        // when a new file is created
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        const result = await fileFetcher.createNewFile(parent, "my-file");
        // then the result is an http error
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr()).toEqual({
          type: "http",
          status: 401,
          title: "The file could not be created",
          detail: "The server responded with 401 Unauthorized",
        });
      });

      it("returns error result if fetch is rejected with an error", async () => {
        // and PUT fails with an error
        when(session.authenticatedFetch)
          .calledWith(expect.anything(), expect.anything())
          .mockRejectedValue(new Error("Network Error"));
        // when a new file is created
        const parent = new LdpContainer(
          "https://pod.test/parent/",
          store,
          true,
        );
        const result = await fileFetcher.createNewFile(parent, "my-file");
        // then the result is a network error
        expect(result.isErr()).toBe(true);
        expect(result._unsafeUnwrapErr()).toEqual({
          type: "network",
          title: "The file could not be created",
          detail: "The server could not be reached: Network Error",
        });
      });
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
