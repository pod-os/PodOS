import { PodOS, AnonymousSession } from "@pod-os/core";

// Create a new PodOS instance
const os = new PodOS({
  session: new AnonymousSession(),
});

// fetch a resource
const webId = "https://pod-os.solidcommunity.net/profile/card#me";
await os.fetch(webId);

// read the resource from store
const me = os.store.get(webId);

// call methods to get data (see https://pod-os.org/reference/core/classes/thing/)
console.info(me.label());
console.info(me.description());
console.info(me.picture().url);

console.table(me.literals());
console.table(me.relations());
