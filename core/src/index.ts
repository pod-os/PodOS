import { Store } from "./Store";

export * from "./authentication";

export const store = new Store();

export const fetch = (uri: string) => store.fetch(uri);
