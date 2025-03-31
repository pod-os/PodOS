import { sym, st } from "rdflib";
import { solid, UpdateOperation } from "@solid-data-modules/rdflib-utils";
import { WebIdProfile } from "../profile";

export function createDefaultLabelIndex(
  profile: WebIdProfile,
): UpdateOperation {
  const webId = sym(profile.webId);
  const preferencesFile = profile.getPreferencesFile();
  const defaultFileName = "privateLabelIndex.ttl";

  const indexUrl = preferencesFile
    ? new URL(defaultFileName, preferencesFile).href
    : new URL(defaultFileName, webId.uri).href;
  const document = preferencesFile ? sym(preferencesFile) : webId.doc();

  return {
    insertions: [
      st(webId, solid("privateLabelIndex"), sym(indexUrl), document),
    ],
    deletions: [],
    filesToCreate: [{ url: indexUrl }],
  };
}
