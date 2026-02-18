import { APPS } from "./apps";

describe("well known solid apps", () => {
  it("SolidOS Data browser uses uri query parameter", () => {
    const app = APPS.DATA_BROWSER;
    expect(app.urlTemplate.expand({ uri: "https://resource.test/" })).toEqual(
      "https://solidos.github.io/mashlib/dist/browse.html?uri=https%3A%2F%2Fresource.test%2F",
    );
  });
  it("Penny uses url query parameter", () => {
    const app = APPS.PENNY;
    expect(app.urlTemplate.expand({ uri: "https://resource.test/" })).toEqual(
      "https://penny.vincenttunru.com/explore/?url=https%3A%2F%2Fresource.test%2F",
    );
  });
  it("Solid File Manager uses url query parameter", () => {
    const app = APPS.SOLID_FILE_MANAGER;
    expect(app.urlTemplate.expand({ uri: "https://resource.test/" })).toEqual(
      "https://otto-aa.github.io/solid-filemanager/?url=https%3A%2F%2Fresource.test%2F",
    );
  });
  it("Umai uses url query parameter", () => {
    const app = APPS.UMAI;
    expect(app.urlTemplate.expand({ uri: "https://resource.test/" })).toEqual(
      "https://umai.noeldemartin.com/viewer?url=https%3A%2F%2Fresource.test%2F",
    );
  });
  it("Dokieli graph uses graph fragment parameter", () => {
    const app = APPS.DOKIELI_GRAPH;
    expect(app.urlTemplate.expand({ uri: "https://resource.test/" })).toEqual(
      "https://dokie.li/#graph=https%3A%2F%2Fresource.test%2F",
    );
  });
  it("Dokieli graph uses open fragment parameter", () => {
    const app = APPS.DOKIELI;
    expect(app.urlTemplate.expand({ uri: "https://resource.test/" })).toEqual(
      "https://dokie.li/#open=https%3A%2F%2Fresource.test%2F",
    );
  });
});
