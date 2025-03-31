import { lit, st, sym } from "rdflib";
import { solid, UpdateOperation } from "@solid-data-modules/rdflib-utils";
import { WebIdProfile } from "../profile";
import { rdfs } from "../namespaces";

export function createDefaultLabelIndex(
  profile: WebIdProfile,
): { uri: string } & UpdateOperation {
  const webId = sym(profile.webId);
  const preferencesFile = profile.getPreferencesFile();
  const defaultFileName = "privateLabelIndex.ttl";

  const indexUrl = preferencesFile
    ? new URL(defaultFileName, preferencesFile).href
    : new URL(defaultFileName, webId.uri).href;
  const preferencesOrProfileDoc = preferencesFile
    ? sym(preferencesFile)
    : webId.doc();

  const indexDocument = sym(indexUrl);
  return {
    uri: indexDocument.uri,
    insertions: [
      st(
        webId,
        solid("privateLabelIndex"),
        indexDocument,
        preferencesOrProfileDoc,
      ),
      st(indexDocument, rdfs("label"), lit("Default Index"), indexDocument),
    ],
    deletions: [],
    filesToCreate: [],
  };
}
