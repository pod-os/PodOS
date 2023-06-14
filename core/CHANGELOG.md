# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.9.0

### Changed

- Omits implicit credentials when using fetch

### Added

- `addNewThing`: A method to add a basic new thing with a type and a label to the store
- `proposeUriForNewThing`: Generate a URI for a new thing based on a name and a reference URI (like a container)

## 0.8.0

### Added

- add `editable` property to `Thing`, which declares whether a thing can be edited
- `addPropertyValue`: A method to add a value to a property of a thing 
- `listKnownTerms`: A method to list a range of well known terms from commonly used RDF vocabularies

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
