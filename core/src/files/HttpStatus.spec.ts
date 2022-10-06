import { HttpStatus } from "./HttpStatus";

describe("HttpStatus", () => {
  it("toString formats status code and status text", () => {
    const status = new HttpStatus(404, "Not Found");
    expect(status.toString()).toEqual("404 - Not Found");
  });
});
