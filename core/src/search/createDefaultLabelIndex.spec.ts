import { createDefaultLabelIndex } from "./createDefaultLabelIndex";
import { WebIdProfile } from "../profile";
import { when } from "jest-when";
import { st, sym } from "rdflib";
import { solid } from "@solid-data-modules/rdflib-utils";

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
    expect(result.insertions).toEqual([
      st(
        sym("https://alice.pod.test/profile/card#me"),
        solid("privateLabelIndex"),
        sym("https://alice.pod.test/settings/privateLabelIndex.ttl"),
        sym("https://alice.pod.test/settings/pref.ttl"),
      ),
    ]);
  });

  it("creates a link in the profile document when no preferences file exists", () => {
    const profile = {
      webId: "https://alice.pod.test/profile/card#me",
      getPreferencesFile: jest.fn(),
    } as unknown as WebIdProfile;
    when(profile.getPreferencesFile).mockReturnValue(undefined);

    const result = createDefaultLabelIndex(profile);

    expect(result.insertions).toEqual([
      st(
        sym("https://alice.pod.test/profile/card#me"),
        solid("privateLabelIndex"),
        sym("https://alice.pod.test/profile/privateLabelIndex.ttl"),
        sym("https://alice.pod.test/profile/card"),
      ),
    ]);
  });

  it("creates a new file for the label index", () => {
    const profile = {
      webId: "https://alice.pod.test/profile/card#me",
      getPreferencesFile: jest.fn(),
    } as unknown as WebIdProfile;
    when(profile.getPreferencesFile).mockReturnValue(
      "https://alice.pod.test/settings/pref.ttl",
    );

    const result = createDefaultLabelIndex(profile);

    expect(result.filesToCreate).toEqual([
      { url: "https://alice.pod.test/settings/privateLabelIndex.ttl" },
    ]);
  });
});
