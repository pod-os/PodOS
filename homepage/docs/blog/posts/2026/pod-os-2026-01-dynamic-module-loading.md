---
date:
  created: 2026-01-28
---

# PodOS 2026.01 adds dynamic module loading

With the latest PodOS release, we are taking a big leap towards **modularity and extensibility**. You can now dynamically load [Solid Data Modules](https://github.com/solid-contrib/data-modules) to add new features to the core system.

Our (still experimental) PodOS contacts app already made use of the contacts data module for some time. Now your own dashboards and apps can load a data module of your choice. Check out the [tutorial to learn how to do that](../../../tutorials/using-solid-data-modules.md).

Any rdflib-based data module is supported:

- [bookmarks](https://www.npmjs.com/package/@solid-data-modules/bookmarks-rdflib)
- [chats](https://www.npmjs.com/package/@solid-data-modules/chats-rdflib)
- [contacts](https://www.npmjs.com/package/@solid-data-modules/contacts-rdflib)

We also did an experimental release of a [@pod-os/contacts](https://www.npmjs.com/package/@pod-os/contacts) component library. Since the provided components are currently very tailored to the PodOS Contacts app and due to change, we **do not recommend** using them yet in your work. But it gives an impression in what direction we are heading to extend PodOS with domain-specific components and features in the future. We will keep you updated!

## Full changelogs

PodOS 2026.01 includes the following components:

- @pod-os/elements 0.36.0
- @pod-os/core 0.25.0

For those of you interested in the full list of changes, here are the release
notes:

- [@pod-os/elements](https://github.com/pod-os/PodOS/blob/2026.01/elements/CHANGELOG.md#changelog)
- [@pod-os/core](https://github.com/pod-os/PodOS/blob/2026.01/core/CHANGELOG.md#changelog)