import { ContactsModule } from "@solid-data-modules/contacts-rdflib";
import { Store } from "../Store";

export async function loadContactsModule(
  store: Store,
): Promise<ContactsModule> {
  const { ContactsModuleRdfLib } = await import(
    "@solid-data-modules/contacts-rdflib"
  );
  return new ContactsModuleRdfLib({
    store: store.graph,
    fetcher: store.fetcher,
    updater: store.updater,
  });
}
