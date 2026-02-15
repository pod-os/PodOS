# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.26.0

### Breaking changes

- `Thing.store` is now a `Store` instead of an `IndexedFormula`. Internal store is no longer accessible. This change also affects all sub-classes of `Thing`. This change is necessary to allow reactivity to be implemented on `Thing` methods.

### Added

- [`PodOS.proposeAppsFor`](https://pod-os.org/reference/core/classes/PodOS/#proposeAppsFor) proposes apps that can open a given resource

### Added

- [`Store.findTypes`]((https://pod-os.org/reference/core/classes/Store/#findTypes)) returns types for a given resource
- [`Store.holds`]((https://pod-os.org/reference/core/classes/Store/#holds)) determines whether the store includes a certain quad pattern
- [`Store.statementsMatching`]((https://pod-os.org/reference/core/classes/Store/#statementsMatching)) returns array of statements matching a quad pattern
- [`Store.each`]((https://pod-os.org/reference/core/classes/Store/#each)) returns array of RDF/JS terms matching the first wild card in a quad pattern
- [`Store.any`]((https://pod-os.org/reference/core/classes/Store/#any)) returns any one RDF/JS term matching the first wildcard in the provided quad pattern
- [`Store.anyValue`]((https://pod-os.org/reference/core/classes/Store/#anyValue)) returns the value of any one RDF/JS term matching the first wildcard in the provided quad pattern
- [`Store.profileQuery`]((https://pod-os.org/reference/core/classes/Store/#profileQuery)) creates a [query](https://solid-contrib.github.io/data-modules/rdflib-utils/classes/index.ProfileQuery.html) to fetch information from a user's profile document
- [`Store.preferencesQuery`]((https://pod-os.org/reference/core/classes/Store/#preferencesQuery)) creates a [query](https://solid-contrib.github.io/data-modules/rdflib-utils/classes/index.PreferencesQuery.html) to fetch information from a user's preferences file
- [`LdpContainer.observeContains`](https://pod-os.org/reference/core/classes/ldpcontainer/#observeContains) pushes new array when `LdpContainer.contains` changes.

## 0.25.0

### Breaking Changes

- `PodOS.loadContactsModule` got removed, use [`PodOS.loadModule`](https://pod-os.org/reference/core/classes/PodOS/#loadmodule) instead
- `@solid-data-modules/contacts-rdflib` is no longer part of core. If you need it, you must install it yourself and load it using [`PodOS.loadModule`](https://pod-os.org/reference/core/classes/PodOS/#loadmodule)

### Added

- [`PodOS.loadModule`](https://pod-os.org/reference/core/classes/PodOS/#loadmodule): Dynamically loads a module by its name

## 0.24.0

### Added

- [`AttachmentGateway`](https://pod-os.org/reference/core/classes/AttachmentGateway/):
  New gateway class to handle attachment upload and linking operations
- [`PodOS.attachments()`](https://pod-os.org/reference/core/classes/PodOS/#attachments):
  Access to the attachment gateway
- [`TypeIndex`](https://pod-os.org/reference/core/classes/TypeIndex/): New class
  to represent and work with Solid type index documents
- [`WebIdProfile.getPublicTypeIndex()`](https://pod-os.org/reference/core/classes/WebIdProfile/#getPublicTypeIndex):
  Get the public type index URI for a user
- [`WebIdProfile.getPrivateTypeIndex()`](https://pod-os.org/reference/core/classes/WebIdProfile/#getPrivateTypeIndex):
  Get the private type index URI for a user
- [`ProfileGateway`](https://pod-os.org/reference/core/classes/ProfileGateway/)
  Gateway for profile-related operations on Solid Pods and the store.
- [`FileGateway`](https://pod-os.org/reference/core/classes/FileGateway/)
  Gateway for file-related operations on Solid Pods and the store.
- [`AttachmentGateway`](https://pod-os.org/reference/core/classes/AttachmentGateway/)
  Gateway for attachment-related operations on Solid Pods and the store.

### Fixed

- continues profile fetch when preferences file fetch fails https://github.com/pod-os/PodOS/issues/174

## 0.23.0

### Added

- [`Store.findMembers`](https://pod-os.org/reference/core/classes/Store/#findMembers) returns instances of classes and subclasses
- [`Store.observeFindMembers`](https://pod-os.org/reference/core/classes/Store/#observeFindMembers) returns an `Observable` and pushes new values when graph is updated

## 0.22.0

### Added

- [`PictureGateway`](https://pod-os.org/reference/core/classes/PictureGateway/): New gateway class to handle picture upload and linking
  operations
- [`PodOS.uploadAndAddPicture()`](https://pod-os.org/reference/core/classes/PictureGateway/#uploadandaddpicture): Upload a picture file and associate it with a
  thing using schema:image predicate
- [`Thing.container()`](https://pod-os.org/reference/core/classes/Thing/#container): Get the LDP container URI for a thing
- [`Store.additions$`](https://pod-os.org/reference/core/classes/Store/#additions) and [`Store.removals$`](https://pod-os.org/reference/core/classes/Store/#removals) are `rxjs` `Subject`s for listening
  to changes to the store

### Changed

- [`PodOS.files().createNewFile()`](https://pod-os.org/reference/core/classes/FileFetcher/#createNewFile):
  Now accepts `File` instances in addition to `Blob` objects, automatically
  using the file's name and type

## 0.21.0

### Added

- [`PodOS.files().createNewFile()`](https://pod-os.org/reference/core/classes/FileFetcher/#createNewFile):
  New method to create new files within a container
- [`PodOS.files().createNewFolder()`](https://pod-os.org/reference/core/classes/FileFetcher/#createNewFolder):
  New method to create new folders within a container
- [`Problem`](https://pod-os.org/reference/core/interfaces/problem/): A new type
  to describe domain errors in PodOS

### Changed

- [`labelFromUri(uri: string)`](https://pod-os.org/reference/core/functions/labelfromuri/):
  add deconding for special characters in URIs, so that they become human
  readable
- [`LdpContainer.contains()`](https://pod-os.org/reference/core/classes/ldpcontainer/#contains):
  Container names now align with the logic from `labelFromUri`

## 0.20.0

### Added

- [`PodOS.files()`](https://pod-os.org/reference/core/classes/PodOS/#files): New
  method to access file operations (fetchFile, etc.)
- [`PodOS.files().putFile()`](https://pod-os.org/reference/core/classes/FileFetcher/#putfile):
  New method to update files

### Changed

- Deprecated
  [`PodOS.fetchFile()`](https://pod-os.org/reference/core/classes/podos/#fetchfile)
  in favor of using
  [`PodOS.files().fetchFile()`](https://pod-os.org/reference/core/classes/FileFetcher/#fetchFile)

## 0.19.0

### Changed

- PodOS can now handle JSON-LD documents as regular RDF documents and work with
  their data

## 0.18.0

### ⚠ BREAKING CHANGES

- `BrowserSession` has moved to `@pod-os/elements`, since it is browser-specific
  which `core` should not be.
- `Store` restricted access to rdflib internals like `fetcher`, `updater` and
  `graph`
  - If you need access to those, you can now pass your own
    [rdflib.js](https://github.com/linkeddata/rdflib.js) store in the
    constructor of `PodOS`. The `fetcher` and `updater` will be attached to this
    store.
  - ⚠ PodOS uses rdflib.js internally, we consider it to be an implementation
    detail. In the future the interface might change to only support
    [RDF/JS](https://rdf.js.org). Please consider this before coupling your
    PodOS app too much to rdflib.js.

### Changed

- `Thing.reverseRelations()`: Now takes optional predicate to filter by

## 0.17.0

### Changed

- `Thing.relations()`: Now takes optional predicate to filter by

## 0.16.1

### Fixed

- Rolled back to solid-client-authn-browser 2.3, due to login issues with newer
  versions.

## 0.16.0

### Added

- Capability to cache data for offline usage
  - `OfflineCapableFetcher`: Drop-in replacement for rdflib.js fetcher that can
    cache data given a cache implementation
  - `NoOfflineCache`: Fallback "cache" for offline usage, which is actually does
    not cache anything at all.

### Changed

- `PodOS`
  - the constructor can now take an optional `PodOsConfiguration`, to set up
    offline cache depending on the environment
  - offline cache will be cleared on logout

## 0.15.0

### Added

- `createDefaultLabelIndex`: a function to create a new label index document at
  a default location and set it up in the user's profile / settings
- `SearchIndex.rebuild()`: rebuild the search index with updated data

## 0.14.0

### Added

- `addToLabelIndex`: a function to include a thing in a label index, so that it
  can be found via search
- `LabelIndex.contains`: a method to check if a label index contains a specific
  URI

## 0.13.0

### Changed

- `Thing.label()`: Shorter fallbacks, instead of full URI, if no label is known
- added a predicate `label` to `Thing.literals()`, `Thing.relations()` and
  `Thing.reverseRelations()`

### Added

- `labelFromUri(uri: string)`: generate a short human-readable label from a URI

## 0.12.0

### Added

- `loadContactsModule`: asynchronously load the contacts data-module
- `onSessionRestore`: Register a callback to get notified about restored
  sessions
- `observeSession`: Returns a rxjs observable that allows to observe the current
  session state and all changes to it

### Changed

- `handleIncomingRedirect`: Added parameter `restorePreviousSession` to allow
  automatic session restore
- `trackSession`: Deprecated in favor of `observeSession`

## 0.11.0

### Added

- `fetchAll`: a function to fetch multiple resources in parallel

### Changed

- `WebIdProfile`: removed `getPrivateLabelIndex` in favour of
  `getPrivateLabelIndexes` to get all label indexes, not just one

## 0.10.0

### Added

- `loadPreferencesFile`: A method to load the preferences file mentioned in the
  WebID profile document
- `buildSearchIndex`: Create a search index to perform a text search for items
  in the private label index
- `SearchIndex`: A fast, in-memory search index based on data from label indexes
- `WebIdProfile`: A class to help find the preferences document and private
  label index of a given WebID

## 0.9.0

### Changed

- Omits implicit credentials when using fetch

### Added

- `addNewThing`: A method to add a basic new thing with a type and a label to
  the store
- `proposeUriForNewThing`: Generate a URI for a new thing based on a name and a
  reference URI (like a container)

## 0.8.0

### Added

- add `editable` property to `Thing`, which declares whether a thing can be
  edited
- `addPropertyValue`: A method to add a value to a property of a thing
- `listKnownTerms`: A method to list a range of well known terms from commonly
  used RDF vocabularies

## 0.7.0

### Added

- LdpContainer
- list contents of LdpContainer

## 0.6.0

### Changed

- thing relations do not contain the types anymore
- thing types now return the URI and a label derived from that URI

## 0.5.0

### Added

- RdfDocument
- list subjects of RdfDocument
- list types of a Thing

## 0.4.0

### Added

- get picture of a thing

## 0.3.0

### Added

- fetching files

## 0.2.0

### Added

- get reverse relations of a Thing

## 0.1.0

### Added

- PodOS
- Browser authentication
- Thing
