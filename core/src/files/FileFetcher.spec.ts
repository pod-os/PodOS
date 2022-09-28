import { when } from "jest-when";
import { PodOsSession } from "../authentication";
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

    // when fetching a blob for that url with the file fetcher
    const result = await new FileFetcher(mockSession).fetchBlob(
      "https://pod.test/image.png"
    );

    // then the blob is returned
    expect(result).toEqual(pngBlob);
  });
});
