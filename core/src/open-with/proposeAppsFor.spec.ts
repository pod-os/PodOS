import { proposeAppsFor } from "./proposeAppsFor";
import { Thing } from "../thing";

describe("proposeAppsFor", () => {
  it("proposes generic data browsers for any type", () => {
    const thing = {
      types: () => ["http://vocab.example#Whatever"],
    } as unknown as Thing;
    const apps = proposeAppsFor(thing);
    expect(apps).toContainEqual({
      name: "Data Browser (SolidOS)",
      appUrl: "https://solidos.github.io/mashlib/dist/browse.html",
      uriParam: "uri",
    });
    expect(apps).toContainEqual({
      name: "Penny",
      appUrl: "https://penny.vincenttunru.com/explore/",
      uriParam: "url",
    });
    expect(apps).toHaveLength(2);
  });
  it("proposes Solid File Manager for LDP containers", () => {
    const thing = {
      types: () => [
        {
          label: "Container",
          uri: "http://www.w3.org/ns/ldp#Container",
        },
      ],
    } as unknown as Thing;
    const apps = proposeAppsFor(thing);
    expect(apps).toContainEqual({
      name: "Solid File Manager",
      appUrl: "https://otto-aa.github.io/solid-filemanager/",
      uriParam: "url",
    });
  });
});
