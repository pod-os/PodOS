import { when } from "jest-when";
import { PodOsSession } from "../authentication";
import { BinaryFile } from "./BinaryFile";
import { BrokenFile } from "./BrokenFile";
import { FileFetcher } from "./FileFetcher";

describe("FileFetcher", () => {
  it("fetches image blob", async () => {
    // given a png blob
    const pngBlob = new Blob(["1"], {
      type: "image/png",
    });

    // and a session
    const mockSession = {
      authenticatedFetch: jest.fn(),
    } as unknown as PodOsSession;

    // and an authenticated fetch for an image url returns the blob
    when(mockSession.authenticatedFetch)
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
    const file = await new FileFetcher(mockSession).fetchFile(
      "https://pod.test/image.png"
    );
    // then the returned file contains the blob
    expect(file).toBeInstanceOf(BinaryFile);
    expect(file.blob()).toEqual(pngBlob);
    // and the url
    expect(file.url).toEqual("https://pod.test/image.png");
  });

  it("returns broken file when fetching failed", async () => {
    // given a session
    const mockSession = {
      authenticatedFetch: jest.fn(),
    } as unknown as PodOsSession;

    // and an authenticated fetch for an image url returns a http error code
    when(mockSession.authenticatedFetch)
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
    const file = await new FileFetcher(mockSession).fetchFile(
      "https://pod.test/image.png"
    );

    // then the returned file is broken
    expect(file).toBeInstanceOf(BrokenFile);
    expect(file.toString()).toBe(
      "https://pod.test/image.png - 404 - Not Found"
    );
    // and the url is present
    expect(file.url).toEqual("https://pod.test/image.png");
  });
});
