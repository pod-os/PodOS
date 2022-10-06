import { HttpStatus } from "./HttpStatus";

describe("HttpStatus", () => {
  describe("toString", () => {
    it("returns status code and status text", () => {
      const status = new HttpStatus(404, "Not Found");
      expect(status.toString()).toEqual("404 - Not Found");
    });

    it("returns ony status if text is missing", () => {
      const status = new HttpStatus(404);
      expect(status.toString()).toEqual("404");
    });
  });
});
