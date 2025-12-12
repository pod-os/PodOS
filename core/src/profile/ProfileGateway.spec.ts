import { ProfileGateway } from "./ProfileGateway";
import { Store } from "../Store";
import { when } from "jest-when";
import { Thing } from "../thing";
import { WebIdProfile } from "./WebIdProfile";

describe("ProfileGateway", () => {
  let store: Store;
  let profile: WebIdProfile;
  let getPreferencesFile: jest.Mock;
  let getPublicTypeIndex: jest.Mock;
  let getPrivateTypeIndex: jest.Mock;
  beforeEach(() => {
    // given a store
    store = {
      fetch: jest.fn(),
      fetchAll: jest.fn(),
      get: jest.fn(),
    } as unknown as Store;
    // and a profile
    getPreferencesFile = jest.fn();
    getPublicTypeIndex = jest.fn();
    getPrivateTypeIndex = jest.fn();
    profile = {
      getPreferencesFile,
      getPublicTypeIndex,
      getPrivateTypeIndex,
    } as unknown as WebIdProfile;
    const assume = jest.fn();
    when(assume).calledWith(WebIdProfile).mockReturnValue(profile);
    when(store.get).mockReturnValue({
      assume,
    } as unknown as Thing);
  });

  it("fetches the profile without preferences", async () => {
    // Given the profile has no preferences file and type index
    getPreferencesFile.mockReturnValue(undefined);
    getPublicTypeIndex.mockReturnValue(undefined);

    // and a profile gateway
    const gateway = new ProfileGateway(store);

    // when fetching the profile
    const result = await gateway.fetchProfile(
      "https://alice.example/profile/card#me",
    );
    // then the profile is fetched via the store
    expect(store.fetch).toHaveBeenCalledWith(
      "https://alice.example/profile/card#me",
    );
    // and returned as the result of the gateway method
    expect(result).toBe(profile);
  });

  it("fetches the profile and preferences", async () => {
    // Given the profile has a preferences file
    getPreferencesFile.mockReturnValue(
      "https://alice.example/settings/pref.ttl",
    );

    // and a profile gateway
    const gateway = new ProfileGateway(store);

    // when fetching the profile
    await gateway.fetchProfile("https://alice.example/profile/card#me");

    // then the preferences file is fetched via the store
    expect(store.fetch).toHaveBeenCalledWith(
      "https://alice.example/settings/pref.ttl",
    );
  });

  it("fetches the public type index", async () => {
    // Given the profile has a public type index
    getPublicTypeIndex.mockReturnValue(
      "https://alice.example/settings/publicTypeIndex.ttl",
    );

    // and a profile gateway
    const gateway = new ProfileGateway(store);

    // when fetching the profile
    await gateway.fetchProfile("https://alice.example/profile/card#me");

    // then the public type index is fetched via the store
    expect(store.fetchAll).toHaveBeenCalledWith([
      "https://alice.example/settings/publicTypeIndex.ttl",
    ]);
  });

  it("fetches the private type index", async () => {
    // Given the profile has a private type index
    getPrivateTypeIndex.mockReturnValue(
      "https://alice.example/settings/privateTypeIndex.ttl",
    );

    // and a profile gateway
    const gateway = new ProfileGateway(store);

    // when fetching the profile
    await gateway.fetchProfile("https://alice.example/profile/card#me");

    // then the public type index is fetched via the store
    expect(store.fetchAll).toHaveBeenCalledWith([
      "https://alice.example/settings/privateTypeIndex.ttl",
    ]);
  });

  it("fetches the private and public type index in parallel", async () => {
    // Given the profile has a private type index
    getPrivateTypeIndex.mockReturnValue(
      "https://alice.example/settings/privateTypeIndex.ttl",
    );
    // and a profile has a public type index
    getPublicTypeIndex.mockReturnValue(
      "https://alice.example/settings/publicTypeIndex.ttl",
    );

    // and a profile gateway
    const gateway = new ProfileGateway(store);

    // when fetching the profile
    await gateway.fetchProfile("https://alice.example/profile/card#me");

    // then the public and private type indexes are fetched via the store in parallel
    expect(store.fetchAll).toHaveBeenCalledWith([
      "https://alice.example/settings/privateTypeIndex.ttl",
      "https://alice.example/settings/publicTypeIndex.ttl",
    ]);
  });

  it("continues profile fetch when preferences file fetch fails", async () => {
    // given a profile with a preferences file
    getPreferencesFile.mockReturnValue(
      "https://alice.example/settings/pref.ttl",
    );
    // and fetching the preferences file returns 404
    when(store.fetch)
      .calledWith("https://alice.example/settings/pref.ttl")
      .mockRejectedValue(
        new Error(
          "Fetcher: <https://alice.example/settings/pref.ttl> 404 - Not Found",
        ),
      );

    // when fetching the profile
    const gateway = new ProfileGateway(store);
    const result = await gateway.fetchProfile(
      "https://alice.example/profile/card#me",
    );

    // then the profile is returned successfully
    expect(result).toBe(profile);
  });
});
