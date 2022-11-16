import { labelForType } from "./labelForType";

describe("labelForType", () => {
  it("returns fragment identifier", () => {
    const result = labelForType("https://vocab.example/types#SomeType");
    expect(result).toBe("SomeType");
  });

  it("returns last path segment if no fragment exists", () => {
    const result = labelForType("https://vocab.example/SomeType");
    expect(result).toBe("SomeType");
  });
});
