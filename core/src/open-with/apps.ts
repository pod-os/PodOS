import { OpenWithApp } from "./types";
import { parseTemplate } from "url-template";

export const APPS: { [key: string]: OpenWithApp } = {
  DATA_BROWSER: {
    name: "Data Browser (SolidOS)",
    urlTemplate: parseTemplate(
      "https://solidos.github.io/mashlib/dist/browse.html{?uri}",
    ),
  },
  PENNY: {
    name: "Penny",
    urlTemplate: parseTemplate(
      "https://penny.vincenttunru.com/explore/?url={uri}",
    ),
  },
  SOLID_FILE_MANAGER: {
    name: "Solid File Manager",
    urlTemplate: parseTemplate(
      "https://otto-aa.github.io/solid-filemanager/?url={uri}",
    ),
  },
  UMAI: {
    name: "Umai",
    urlTemplate: parseTemplate(
      "https://umai.noeldemartin.com/viewer?url={uri}",
    ),
  },
  DOKIELI: {
    name: "dokieli",
    urlTemplate: parseTemplate("https://dokie.li/#open={uri}"),
  },
  DOKIELI_GRAPH: {
    name: "dokieli Graph",
    urlTemplate: parseTemplate("https://dokie.li/#graph={uri}"),
  },
};
