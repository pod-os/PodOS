import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { WebIdProfile } from "../profile";
import { when } from "jest-when";
import { lit, st, sym } from "rdflib";
import { solid } from "@solid-data-modules/rdflib-utils";
import { rdfs } from "../namespaces";

describe(createDefaultLabelIndex, () => {
  it("creates a link from the profile to a private label index in the settings", () => {
    const profile = {
      webId: "https://alice.pod.test/profile/card#me",
      getPreferencesFile: jest.fn(),
    } as unknown as WebIdProfile;
    when(profile.getPreferencesFile).mockReturnValue(
      "https://alice.pod.test/settings/pref.ttl",
    );
    const result = createDefaultLabelIndex(profile);
    expect(result.insertions).toContainEqual(
      st(
        sym("https://alice.pod.test/profile/card#me"),
        solid("privateLabelIndex"),
        sym("https://alice.pod.test/settings/privateLabelIndex.ttl"),
        sym("https://alice.pod.test/settings/pref.ttl"),
      ),
    );
  });

  it("creates a link in the profile document when no preferences file exists", () => {
    const profile = {
      webId: "https://alice.pod.test/profile/card#me",
      getPreferencesFile: jest.fn(),
    } as unknown as WebIdProfile;
    when(profile.getPreferencesFile).mockReturnValue(undefined);

    const result = createDefaultLabelIndex(profile);

    expect(result.insertions).toContainEqual(
      st(
        sym("https://alice.pod.test/profile/card#me"),
        solid("privateLabelIndex"),
        sym("https://alice.pod.test/profile/privateLabelIndex.ttl"),
        sym("https://alice.pod.test/profile/card"),
      ),
    );
  });

  it("creates a name for the index document", () => {
    const profile = {
      webId: "https://alice.pod.test/profile/card#me",
      getPreferencesFile: jest.fn(),
    } as unknown as WebIdProfile;
    when(profile.getPreferencesFile).mockReturnValue(undefined);

    const result = createDefaultLabelIndex(profile);

    expect(result.insertions).toContainEqual(
      st(
        sym("https://alice.pod.test/profile/privateLabelIndex.ttl"),
        rdfs("label"),
        lit("Default Index"),
        sym("https://alice.pod.test/profile/privateLabelIndex.ttl"),
      ),
    );
  });

  it("returns the URI of the created index", () => {
    const profile = {
      webId: "https://alice.pod.test/profile/card#me",
      getPreferencesFile: jest.fn(),
    } as unknown as WebIdProfile;
    when(profile.getPreferencesFile).mockReturnValue(
      "https://alice.pod.test/settings/pref.ttl",
    );
    const result = createDefaultLabelIndex(profile);
    expect(result.uri).toEqual(
      "https://alice.pod.test/settings/privateLabelIndex.ttl",
    );
  });
});
