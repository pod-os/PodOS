# Full Text Search

## Context and Problem Statement

Users should be able to find things by name / label. The PodOS navigation bar
should be enhanced to a search bar, where users can enter plain text instead of
full URIs. Also, users shall be able to link things to one another and there need
to find them by a name they remember instead of a cryptic URI.

## Considered Options

### Search execution

- Comunica Link Traversal
- SPARQL search via rdflib.js
- SPARQL search via Comunica
- Lunr.js

### Search index

- index the whole Pod
- index anything the users visits
- build index manually by users choice

## Decision Outcome

Build a manual index by users choice and perform a search via Lunr.js.

The index could be persisted in a turtle document linked from the users profile.
PodOS can find and load this document on startup and create a Lunr index from it.

### Reasoning

#### Comunica Link Traversal

This is very powerful, since it is able to traverse search the whole Pod and
even follow links to other Pods, but it is two slow to be practically usable for
a type-ahead search. It can be considered for advanced searches later on.

#### SPARQL search via rdflib.js

rdflib.js only supports a subset of SPARQL and cannot do e.g. filtering by
regex, therefore it is not feasible for the task.

#### SPARQL search via Comunica

Comunica can do SPARQL with filter by regex, but the rdflib.js store we are
currently using is not compatible to the current RDF/JS Source interface
Comunica requires. Also, SPARQL in general seems not to support fuzzy matching
to ignore e.g. small typos. Search resuls do not have a score.

#### Lunr.js

This is not an RDF specific solution, but a quite powerful client-side search
tool. A Lunr index could be created out of RDF data. It also turned out to be
quite fast and bulit an index of 10.000 documents in 1 second. Also Lunr search
results contain a score to be able to order resuls by how good they match the
query.

#### Index the whole Pod

This would take a long time. Also, there might be things users do not want to
have in the index.

#### Index anything the users visits

The index would basically contain the whole browsing history of the user, which
raises privacy issues. Also, things might be indexed that are irrelevant for a
later search.

#### Build index manually by users choice

This gives the user most control over what to index and what not, and it prevents
finding irrelevant stuff later.

### Positive Consequences

- Fast search
- Find only things that are relevant

### Negative Consequences

- User has to add things manually to the search index
- Lunr.js has an immutable index which needs to be re-created anytime things change.

## Links

- [Lunr.js](https://lunrjs.com)
- [Comunica](https://comunica.dev)
- [RDF/JS Source Interface](https://rdf.js.org/stream-spec/#source-interface)
- [Comunica Link Traversal](https://comunica.dev/research/link_traversal/)
