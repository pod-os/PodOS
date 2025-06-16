# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- [pos-list](../docs/elements/components/pos-list):
  - Basic implementation of element to list things related to a resource with a custom display

## 0.25.2

### Fixed

- Login issues due to solid-client-authn-browser version from pod-os/core

## 0.25.1

### Fixed

Rolled back to stencil to 4.24, due to a blank page issue with the ionic version in use (see https://github.com/stenciljs/core/issues/6274). Since we are phasing out ionic, we will delay the stencil update until then.

## 0.25.0

### Added

- `IndexedDbOfflineCache`: A PodOS cache implementation that uses IndexedDB to store data for offline usage
- [pos-app-settings](../docs/elements/apps/pos-app-settings)
  - A settings app, which currently only serves the Offline Cache setting
- [pos-setting-offline-cache](../docs/elements/apps/pos-app-settings/pos-setting-offline-cache): Enable / Disable offline cache

### Changed

- [pos-app](../docs/elements/components/pos-app):
  - Is now capable of reading local settings from localstorage
  - will enable offline cache using IndexedDB when found in the settings
- [pos-error-toast](../docs/elements/components/pos-error-toast):
  - Will pre-fetch relevant child components, so that errors can be shown even when offline and the components would otherwise not have been loaded yet
- [pos-internal-router](../docs/elements/components/pos-internal-router):
  - will navigate to the settings app for URI `pod-os:settings`

## 0.24.1

### Fixed

- [pos-make-findable](../docs/elements/components/pos-make-findable)
  - also emits index update event, when one of multiple indexes is chosen

## 0.24.0

### Changed

- [pos-make-findable](../docs/elements/components/pos-make-findable)
  - creates a default label index if the user has not yet configured one
- [pos-navigation-bar](../docs/elements/components/pos-navigation-bar)
  - keeps the search index up-to-date after making things findable

## 0.23.1

### Fixed

- [pos-make-findable](../docs/elements/components/pos-make-findable)
  - Now waits for the index to load before indicating the status, so that no wrong indication is made on hard page reload
  - Error on dashboard (empty URI) prevented

## 0.23.0

## Added

- [pos-make-findable](../docs/elements/components/pos-make-findable): Widget to add a resource to a label index to make it findable by search

## Changed

- [pos-navigation-bar](../docs/elements/components/pos-navigation-bar): Add "make-findable" feature

## 0.22.1

### Fixed

- [pos-container-contents](../docs/elements/components/pos-container-contents): Style fixes
- [pos-rich-link](../docs/elements/components/pos-rich-link): Larger font sizes on mobile
- some more minor style fixes

## 0.22.0

## Added

- [pos-image](../docs/elements/components/pos-image): new property `blurred-background`
- [pos-picture](../docs/elements/components/pos-image): new property `blurred-background`

## Changed

- [pos-app-generic](../docs/elements/apps/pos-app-generic): Redesign

## 0.21.0

### Added

- [pos-predicate](../docs/elements/components/pos-predicate): a component to render a predicate in a human-centric way

### Changed

- [pos-label](../docs/elements/components/pos-label): shorter fallback labels 
- [pos-rich-link](../docs/elements/components/pos-rich-link): Redesigned to reduce clutter and duplicate information
- [pos-relations](../docs/elements/components/pos-relations): shorter labels for predicates & redesign
- [pos-reverse-relations](../docs/elements/components/pos-reverse-relations): shorter labels for predicates & redesign
- [pos-literals](../docs/elements/components/pos-literals): shorter labels for predicates & redesign
- [pos-container-contents](../docs/elements/components/pos-container-contents): does not show URI anymore
- [pos-subjects](../docs/elements/components/pos-subjects): redesign
- [pos-navigation-abr](../docs/elements/components/pos-navigation-bar): Style changes for search results

## 0.20.0

### ⚠ BREAKING CHANGES

- [pos-app-browser](../docs/elements/apps/pos-app-browser)
  - new `mode` property, defaulting to `standalone`, if you want to preserve the old behaviour, set it to `pod` instead. Otherwise, the app will show the new dashboard component, if now `uri` query param is present.
- [pos-router](../docs/elements/components/pos-router)
  - new `mode` property, defaulting to `standalone`, if you want to preserve the old behaviour, set it to `pod` instead. Otherwise, the router will route to the new dashboard component, if now `uri` query param is present.

### Added

- [pos-internal-router](../docs/elements/components/pos-internal-router)
  - a router that handles internal URIs starting with `pod-os:`
- [pos-app-dashboard](../docs/elements/apps/pos-app-dashboard)
  - A dashboard app, that can serve as an entry point to PodOS

## 0.19.0

### ⚠ BREAKING CHANGES

- [pos-router](../docs/elements/components/pos-router)
  - new event `pod-os:route-changed`, that fires whenever the `uri` query param changes
  - The router does not include a `pos-resource` and `pos-type-router` anymore. You have to include them yourself, if you want to restore the old behaviour:

```tsx
<pos-router onPod-os:route-changed={e => this.uri = e.detail}>
  <pos-resource uri={this.uri}>
    <pos-type-router />
  </pos-resource>
</pos-router>
```

### Changed

- [pos-login](../docs/elements/components/pos-login): Minor styling adjustments
- [pos-app-browser](../docs/elements/apps/pos-app-browser)
  - redesign of header, footer and navigation bar
- [pos-image](../docs/elements/components/pos-image)
  - new CSS variable --object-fit to apply [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit) to the img (defaults to `cover`)

## 0.18.0

- [pos-image](../docs/elements/components/pos-image)
  - fall back to normal img tag with src on CORS errors

## 0.17.0

- [pos-app](../docs/elements/components/pos-app)
  - Can now handle new events of type `pod-os:module`, to asynchronously load a module and pass it to the component that triggered the event. Currently only the `contacts` module is supported.
  - new property `restore-previous-session` allows to restore the session after a refresh or opening in new tab
  - fires new event `pod-os:session-restored` whenever a session is restored
- [pos-app-browser](../docs/elements/apps/pos-app-browser)
  - new property `restore-previous-session` allows to restore the session after a refresh or opening in new tab
- [pos-router](../docs/elements/components/pos-router)
  - will navigate back to the original URL after a session has been restored
  
## 0.16.0

### Added

- [pos-dialog](../docs/elements/components/pos-dialog): A dialog component with a common style
- [pos-login-form](../docs/elements/components/pos-login-form): A form to select a identity provider for logging in

### Changed

- [pos-login](../docs/elements/components/pos-login): Now shows a dedicated login dialog using [pos-login-form](../docs/elements/components/pos-login-form) instead of a browser prompt

## 0.15.0

### Changed

- [pos-navigation-bar](../docs/elements/components/pos-navigation-bar): Support multiple private label indexes for search

## 0.14.0

### Changed

- [pos-app](../docs/elements/components/pos-app): After login `pos-app` now loads the preferences file that is linked in the user's WebID profile (if any).
- [pos-rich-link](../docs/elements/components/pos-rich-link): Redesigned & removed dependency on ionic. Added variables to apply custom styles.
- [pos-navigation-bar](../docs/elements/components/pos-navigation-bar): Added full text search for users that have a label index.

## 0.13.0

### Added

- [pos-add-new-thing](../docs/elements/components/pos-add-new-thing): A button and dialog to add a new thing
- [pos-new-thing-form](../docs/elements/components/pos-new-thing-form): A form to add a new thing by type and name

### Changed

- [pos-router](../docs/elements/components/pos-router): Allow to add a thing based on the current location
- [pos-select-term](../docs/elements/components/pos-select-term): Delegates focus to internal input. Can receive a value via attribute.

## 0.12.0

### Added

- [pos-select-term](../docs/elements/components/pos-select-term): An input component to select from a list of common terms
- [pos-add-literal-value](../docs/elements/components/pos-add-literal-value): An input component to add a value to a property of a resource
- [pos-error-toast](../docs/elements/components/pos-error-toast): Shows a toast when an error occurs

### Changed

- [pos-literals](../docs/elements/components/pos-literals): Allows to add a property value when resource is editable

## 0.11.0

### Breaking change

- [pos-app](../docs/elements/components/pos-app): Decouple pos-app from ionic ion-app, so that basic elements can be used without ionic. If you want to keep the existing behaviour as before you need to manually wrap everything within `<pos-app></pos-app>` in an additional `<ion-app></ion-app>`.

### Added

- New event `pod-os:resource-loaded` is fired after `pos-resource`, `pos-image` or `pos-document` finished loading the requested resource.
- [pos-value](../docs/elements/components/pos-value): A component to render a value for a given predicate

## 0.10.0

### Added

- [pos-app-ldp-container](../docs/elements/apps/pos-app-ldp-container): View an LDP container and its contents
- [pos-container-contents](../docs/elements/components/pos-container-contents): A list of everything a LDP container contains

## 0.9.0

### Breaking Changes

- pos-app-pdf-viewer renamed to [pos-app-document-viewer](../docs/elements/apps/pos-app-document-viewer) to reflect that it can show many types of documents.
- pos-pdf renamed to [pos-document](../docs/elements/components/pos-pdf) to reflect that it can display many kinds of documents.

### Changed

- [pos-type-router](../docs/elements/components/pos-type-router): Route to pos-app-document-viewer for more document resources, like html, markdown and others.

## 0.8.0

### Added

- [pos-app-pdf-viewer](../docs/elements/apps/pos-app-pdf-viewer): A viewer for pdf document resources
- [pos-pdf](../docs/elements/components/pos-pdf): A component to render a PDF document

### Changed

- [pos-type-router](../docs/elements/components/pos-type-router): Route to pos-app-pdf-viewer for pdf resources
- [pos-image](../docs/elements/components/pos-image): Added alt attribute
- [pos-picture](../docs/elements/components/pos-picture): Adds resource label as alt attribute to image

## 0.7.0

### Added

- [pos-app-image-viewer](../docs/elements/apps/pos-app-image-viewer): A viewer for image resources
- [pos-image](../docs/elements/components/pos-image): New CSS custom properties for max-width and max-height

### Changed

- [pos-type-router](../docs/elements/components/pos-type-router): Route to pos-app-image-viewer for image resources

## 0.6.0

### Added

- [pos-type-badges](../docs/elements/components/pos-type-badges): Show rdf types as simple badges
- Show type badges in [pos-app-generic](../docs/elements/apps/pos-app-generic) and [pos-app-rdf-document](../docs/elements/apps/pos-app-rdf-document)

### Changed

- Remove types from [pos-relations](../docs/elements/components/pos-relations)
- Better error description when [pos-resource](../docs/elements/components/pos-resource) fails to load

## 0.5.0

### Added

- [pos-app-browser](../docs/elements/apps/pos-app-browser): PodOS browser application
- [pos-navigation-bar](../docs/elements/components/pos-navigation-bar): Navigate to URI by entering it

## 0.4.0

### Added

- [pos-subjects](../docs/elements/components/pos-subjects): List subjects mentioned in a document
- [pos-app-rdf-document](../docs/elements/apps/pos-app-rdf-document): Shows information from rdf documents
- [pos-type-router](../docs/elements/components/pos-type-router): Routes to apps depending on resource type

## 0.3.0

### Added

- [pos-picture](../docs/elements/components/pos-picture)

### Changed

- Show resource picture in pos-app-generic
- pos-login: Show picture of signed-in user

## 0.2.0

### Added

- [pos-image](../docs/elements/components/pos-image)

## 0.1.0

### Added

- [Components](../docs/elements/components/):
  - pos-app
  - pos-resource
  - pos-label
  - pos-description
  - pos-literals
  - pos-login
  - pos-relations
  - pos-reverse-relations
  - pos-rich-link
  - pos-router
- Apps:
  - [pos-app-generic](../docs/elements/apps/pos-app-generic)