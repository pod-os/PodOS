import { PodOS, AnonymousSession } from "@pod-os/core";

// Create a new PodOS instance
const os = new PodOS({
  session: new AnonymousSession(),
});

// load a module, e.g. the contacts Solid Data Module
const contactsModule = await os.loadModule(
  "@solid-data-modules/contacts-rdflib",
);

// use the module regularly
const addressBook = await contactsModule.readAddressBook(
  "https://solidos.solidcommunity.net/Contacts/index.ttl#this",
);

// all data fetched via module is also available via PodOS
const someone = os.store.get(addressBook.contacts[0].uri);
console.log(someone.label());
