import { Thing } from "../thing";

import { OpenWithApp } from "./types";
import { APPS } from "./apps";

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
