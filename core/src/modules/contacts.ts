import { ContactsModule } from "@solid-data-modules/contacts-rdflib";
import { Store } from "../Store";

export async function loadContactsModule(
  store: Store,
): Promise<ContactsModule> {
  const module = await import("@solid-data-modules/contacts-rdflib");
  return store.loadModule(module);
}
