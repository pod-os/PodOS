import { Thing } from "../thing";

import { OpenWithApp } from "./types";

/**
 * Returns a list of apps that can be used to open a resource
 * @param uri - The URI of the resource to open
 */
export function proposeAppsFor(thing: Thing): OpenWithApp[] {
  const apps = [
    {
      name: "Data Browser (SolidOS)",
      appUrl: "https://solidos.github.io/mashlib/dist/browse.html",
      uriParam: "uri",
    },
    {
      name: "Penny",
      appUrl: "https://penny.vincenttunru.com/explore/",
      uriParam: "url",
    },
  ];
  if (
    thing
      .types()
      .map((it) => it.uri)
      .includes("http://www.w3.org/ns/ldp#Container")
  ) {
    apps.push({
      name: "Solid File Manager",
      appUrl: "https://otto-aa.github.io/solid-filemanager/",
      uriParam: "url",
    });
  }
  return apps;
}
