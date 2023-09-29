# Text Search

PodOS can do a text search for things by their name. To do this, it makes use of a label index. This index is not covered by any standard, yet, and therefore described here shortly.

To enable the search feature a user has to link an index file via `solid:privateLabelIndex` to their WebID like this:

```turtle
@prefix solid: <http://www.w3.org/ns/solid/terms#>.


</alice/profile/card#me>
solid:privateLabelIndex <privateLabelIndex.ttl> ;
.
```

This statement has to either be present in the [WebID profile](https://solid.github.io/webid-profile/) directly, or in the [private preferences document](https://solid.github.io/webid-profile/#private-preferences).

The index itself is just a RDF document containing statements in the form

```turtle
@prefix rdfs:   <http://www.w3.org/2000/01/rdf-schema#> .

<subject> rdfs:label "Label literal" .
```

All the labels will be indexed by the PodOS search and make the `<subject>` findable.

Be aware that the term `solid:privateLabelIndex` is not part of the official vocabulary yet, but used by PodOS anyhow as a Proof of Concept. Consider it to be experimental and unstable.

For architectural decision about the search implementation see [0008-full-text-search.md](../decisions/0008-full-text-search.md).