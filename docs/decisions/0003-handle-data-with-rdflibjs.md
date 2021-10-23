# Handle data with rdflib.js

## Context and Problem Statement

PodOS needs to load and process RDF data in a very generic way to be able to
provide generic data browsing and to propose specific apps that are fitting for
a resource. It should also be able to process data locally, that has been
fetched already.

## Considered Options

- rdflib.js
- solid-client by Inrupt

## Decision Outcome

Use rdflib.js in PodOS core. It has been successfully used on
[SolidOS](https://github.com/solid/solidos) for the same use case. The
solid-client by Inrupt seems to be good to load specific datasets known
beforehand, but it is hard to use for generic fetching and processing. It does
not combine all fetched data to a local store.

rdflib.js shall be used only in PodOS core to handle the data for PodOS
elements. The latter must not depend on rdflib.js, only on PodOS core.
