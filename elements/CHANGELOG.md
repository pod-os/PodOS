# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.8.0

## Added

- [pos-app-pdf-viewer](../docs/elements/apps/pos-app-pdf-viewer): A viewer for pdf document resources
- [pos-pdf](../docs/elements/components/pos-pdf): A component to render a PDF document

## Changed

- [pos-image](../docs/elements/components/pos-image): Added alt attribute
- [pos-picture](../docs/elements/components/pos-picture): Adds resource label as alt attribute to image

## 0.7.0

## Added

- [pos-app-image-viewer](../docs/elements/apps/pos-app-image-viewer): A viewer for image resources
- [pos-image](../docs/elements/components/pos-image): New CSS custom properties for max-width and max-height

## Changed

- [pos-type-router](../docs/elements/components/pos-type-router): Route to pos-app-image-viewer for image resources

## 0.6.0

## Added

- [pos-type-badges](../docs/elements/components/pos-type-badges): Show rdf types as simple badges
- Show type badges in [pos-app-generic](../docs/elements/apps/pos-app-generic) and [pos-app-rdf-document](../docs/elements/apps/pos-app-rdf-document)

## Changed

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