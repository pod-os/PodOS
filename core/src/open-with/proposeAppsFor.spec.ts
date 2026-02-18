import { proposeAppsFor } from "./proposeAppsFor";
import { Thing } from "../thing";
import { APPS } from "./apps";

describe("proposeAppsFor", () => {
  it("proposes generic data browsers for any type", () => {
    const thing = {
      types: () => ["http://vocab.example#Whatever"],
    } as unknown as Thing;
    const apps = proposeAppsFor(thing);
    expect(apps).toContainEqual(APPS.DATA_BROWSER);
    expect(apps).toContainEqual(APPS.PENNY);
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
    expect(apps).toContainEqual(APPS.SOLID_FILE_MANAGER);
  });

  it.each(["http://schema.org/Recipe", "https://schema.org/Recipe"])(
    "proposes Umai for recipes",
    (uri) => {
      const thing = {
        types: () => [
          {
            label: "Recipe",
            uri,
          },
        ],
      } as unknown as Thing;
      const apps = proposeAppsFor(thing);
      expect(apps).toContainEqual(APPS.UMAI);
    },
  );

  it("proposes dokilie graph for rdf documents", () => {
    const thing = {
      types: () => [
        {
          label: "RDF document",
          uri: "http://www.w3.org/2007/ont/link#RDFDocument",
        },
      ],
    } as unknown as Thing;
    const apps = proposeAppsFor(thing);
    expect(apps).toContainEqual(APPS.DOKIELI_GRAPH);
  });
});
