# Align UI data binding attributes with RDFa

- Status: accepted
- Deciders: [jg10](https://jg10.solidcommunity.net/profile/card#me), [Angelo Veltens](https://angelo.veltens.org/profile/card#me)

## Context and Problem Statement

Low level elements such as `pos-value` and `pos-list` effectively have a UI data
binding role - they bind data from an RDF graph to the HTML element. They
commonly do so either by following a predicate forward or backward from a
subject, with predicates specified through HTML attributes. In selecting names
for these and other related HTML attributes, it is useful to have a consistent
model that a dashboard developer can learn.

## Decision Drivers

- If an existing model can be used, it is both easier and more valuable for a
  dashboard developer to learn, because they can use examples outside of PodOS
  and can apply their understanding elsewhere.
- If the model required by PodOS differs too much from an existing model, then
  it may be better to clearly differentiate it rather than try to force
  compatibility.
- The interpretation of HTML attributes on low level elements differs before and
  after hydration - there is an inherent instability in their meaning

## Considered Options

- Adding further to existing PodOS attributes, e.g. `predicate` and `uri`
- Adopting RDFa as-is
- Adopting RDFa only where hydrated PodOS elements would be compliant, and
  creating attributes based on an unrelated model otherwise
- Adopting RDFa where hydrated PodOS elements would be compliant, and using
  RDFa-aligned terms otherwise

Note that this applies only to attributes for low level UI data binding
elements, not to higher level elements that abstract out the RDF graph, e.g.
`pos-label`.

## Decision Outcome

Chosen option: adopting RDFa where hydrated PodOS elements would be compliant,
and using RDFa-aligned terms otherwise.

RDFa provides an existing, standard model built on RDF in which the relationship
to (hydrated) HTML has already been considered, and for which tools exist. It
already defines attributes that PodOS had not yet implemented (e.g. `rev`,
`prefix`, `typeof`), and
[it has been demonstrated](https://github.com/pod-os/PodOS/issues/43#issuecomment-2838813437)
that hydrated PodOS elements can produce valid RDFa. The state of the HTML after
hydration can therefore provide a point of reference.

RDFa does not provide attributes for queries/list filtering, and the logic of
queries expressed in attributes of hydrated elements cannot be easily expressed
as RDFa. However, there remains a close relationship between RDFa attributes and
corresponding query attributes that means that having two related models is
expected to be easier to understand than having two unrelated models.

### Positive Consequences

- The ability to test whether output is valid RDFa provides clear guidance on
  the behaviour that attributes should demonstrate
- Hydrated low level PodOS elements should be understandable by a broad audience
  familiar with RDFa.
- The role of UI data binding attributes before hydration should be
  understandable by reference to the valid RDFa they will produce.
- Once RDFa terms are understood, RDFa-aligned terms should be easier to learn
  than if they were completely new
- There is potential for RDFa-aligned attributes to be standardized in future
  and used elsewhere, further lowering the barrier to entry

### Negative Consequences

- Users who don't know RDFa will still need to learn the attributes
- RDFa-aligned terms will still be new and untested and surprises may still
  emerge.
- Attributes for some existing low level PodOS elements will need to be
  deprecated and replaced.