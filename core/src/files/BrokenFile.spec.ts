import { BrokenFile } from "./BrokenFile";
import { HttpStatus } from "./HttpStatus";

describe("BrokenFile", () => {
  it("blob is null", () => {
    const file = new BrokenFile(
      "https://pod.test/missing.png",
      new HttpStatus(404, "Not Found")
    );
    expect(file.blob()).toBeNull();
  });

  it("toString returns url and status", () => {
    const file = new BrokenFile(
      "https://pod.test/missing.png",
      new HttpStatus(404, "Not Found")
    );
    expect(file.toString()).toBe(
      "404 - Not Found - https://pod.test/missing.png"
    );
  });
});
