import { ContactsModule } from '@solid-data-modules/contacts-rdflib';

export function useContactsModule(el: HTMLElement): Promise<ContactsModule> {
  return new Promise(resolve => {
    el.dispatchEvent(
      new CustomEvent('pod-os:module', {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          module: 'contacts',
          receiver: resolve,
        },
      }),
    );
  });
}
