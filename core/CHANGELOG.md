# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- `Store.findMembers` returns instances of classes and subclasses
- `Store.observeFindMembers` returns an Observable and pushes new values when graph is updated

## 0.18.0

### ⚠ BREAKING CHANGES

- `BrowserSession` has moved to `@pod-os/elements`, since it is browser-specific which `core` should not be.
- `Store` restricted access to rdflib internals like `fetcher`, `updater` and `graph`
  - If you need access to those, you can now pass your own [rdflib.js](https://github.com/linkeddata/rdflib.js) store in the constructor of `PodOS`. The `fetcher` and `updater` will be attached to this store.
  - ⚠ PodOS uses rdflib.js internally, we consider it to be an implementation detail. In the future the interface might change to only support [RDF/JS](https://rdf.js.org). Please consider this before coupling your PodOS app too much to rdflib.js.

### Changed

- `Thing.reverseRelations()`: Now takes optional predicate to filter by

## 0.17.0

### Changed

- `Thing.relations()`: Now takes optional predicate to filter by

## 0.16.1

### Fixed

- Rolled back to solid-client-authn-browser 2.3, due to login issues with newer versions.

## 0.16.0

### Added

- Capability to cache data for offline usage
  - `OfflineCapableFetcher`: Drop-in replacement for rdflib.js fetcher that can cache data given a cache implementation
  - `NoOfflineCache`: Fallback "cache" for offline usage, which is actually does not cache anything at all. 

### Changed

- `PodOS`
  - the constructor can now take an optional `PodOsConfiguration`, to set up offline cache depending on the environment
  - offline cache will be cleared on logout

## 0.15.0

### Added

- `createDefaultLabelIndex`: a function to create a new label index document at a default location and set it up in the user's profile / settings
- `SearchIndex.rebuild()`: rebuild the search index with updated data

## 0.14.0

### Added

- `addToLabelIndex`: a function to include a thing in a label index, so that it can be found via search
- `LabelIndex.contains`: a method to check if a label index contains a specific URI

## 0.13.0

### Changed

- `Thing.label()`: Shorter fallbacks, instead of full URI, if no label is known
- added a predicate `label` to `Thing.literals()`, `Thing.relations()` and `Thing.reverseRelations()`

### Added

- `labelFromUri(uri: string)`: generate a short human-readable label from a URI

## 0.12.0

### Added

- `loadContactsModule`: asynchronously load the contacts data-module
- `onSessionRestore`: Register a callback to get notified about restored sessions
- `observeSession`: Returns a rxjs observable that allows to observe the current session state and all changes to it

### Changed

- `handleIncomingRedirect`: Added parameter `restorePreviousSession` to allow automatic session restore
- `trackSession`: Deprecated in favor of `observeSession`

## 0.11.0

### Added

- `fetchAll`: a function to fetch multiple resources in parallel

### Changed

- `WebIdProfile`: removed `getPrivateLabelIndex` in favour of `getPrivateLabelIndexes` to get all label indexes, not just one

## 0.10.0

### Added

- `loadPreferencesFile`: A method to load the preferences file mentioned in the WebID profile document
- `buildSearchIndex`: Create a search index to perform a text search for items in the private label index
- `SearchIndex`: A fast, in-memory search index based on data from label indexes
- `WebIdProfile`: A class to help find the preferences document and private label index of a given WebID

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
