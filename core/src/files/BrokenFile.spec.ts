import { BrokenFile } from "./BrokenFile";
import { HttpStatus } from "./HttpStatus";

describe("BrokenFile", () => {
  it("toString returns url and status", () => {
    const file = new BrokenFile(
      "https://pod.test/missing.png",
      new HttpStatus(404, "Not Found")
    );
    expect(file.toString()).toBe(
      "https://pod.test/missing.png - 404 - Not Found"
    );
  });
});
