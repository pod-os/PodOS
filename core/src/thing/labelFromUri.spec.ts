import { labelFromUri } from "./labelFromUri";

describe("label from URI", () => {
  it.each([
    "https://jane.doe.example/container/file.ttl#fragment",
    "https://jane.doe.example#fragment",
  ])("the fragment is used", (uri) => {
    const result = labelFromUri(uri);
    expect(result).toBe("fragment");
  });

  it("the file name is used, if no fragment is given", () => {
    const result = labelFromUri("https://jane.doe.example/container/file.ttl");
    expect(result).toBe("file.ttl");
  });

  it("container name is used if no file is present", () => {
    const result = labelFromUri("https://jane.doe.example/container/");
    expect(result).toBe("container/");
  });

  describe("if fragments are too generic", () => {
    it.each([
      { uri: "https://jane.doe.example/resource#it", label: "resource#it" },
      {
        uri: "https://jane.doe.example/resource#this",
        label: "resource#this",
      },
      { uri: "https://jane.doe.example/profile/card#me", label: "card#me" },
      { uri: "https://jane.doe.example/#i", label: "jane.doe.example/#i" },
      { uri: "https://jane.doe.example/profile/#me", label: "profile/#me" },
    ])("file and fragment are both used", ({ uri, label }) => {
      const result = labelFromUri(uri);
      expect(result).toBe(label);
    });
  });

  it("the host name is used, if no path is given", () => {
    const result = labelFromUri("https://jane.doe.example/");
    expect(result).toBe("jane.doe.example");
  });
});
