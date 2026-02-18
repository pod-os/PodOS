import { Thing } from "../thing";

import { OpenWithApp } from "./types";

const APPS: { [key: string]: OpenWithApp } = {
  DATA_BROWSER: {
    name: "Data Browser (SolidOS)",
    appUrl: "https://solidos.github.io/mashlib/dist/browse.html",
    uriParam: "uri",
  },
  PENNY: {
    name: "Penny",
    appUrl: "https://penny.vincenttunru.com/explore/",
    uriParam: "url",
  },
  SOLID_FILE_MANAGER: {
    name: "Solid File Manager",
    appUrl: "https://otto-aa.github.io/solid-filemanager/",
    uriParam: "url",
  },
};

// TODO more apps
const appRegistrations: { [key: string]: OpenWithApp[] } = {
  "http://www.w3.org/ns/ldp#Container": [APPS.SOLID_FILE_MANAGER],
};

/**
 * Returns a list of apps that can be used to open a resource
 * @param uri - The URI of the resource to open
 */
export function proposeAppsFor(thing: Thing): OpenWithApp[] {
  const apps = [APPS.DATA_BROWSER, APPS.PENNY];
  const appsForType = thing
    .types()
    .flatMap((it) => appRegistrations[it.uri])
    .filter((it) => it !== undefined);
  return [...apps, ...appsForType];
}
