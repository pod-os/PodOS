# Elements implement reactivity by setting Stencil state from rxjs observables defined in PodOS core

- Status: accepted
- Deciders: jg10, angelo-v


Technical Story: The UI provided by PodOS elements should update reactively to changes to the global graph store [#37](https://github.com/pod-os/PodOS/issues/37)

## Context and Problem Statement

If I edit content in one part of the browser or dashboard, I want the same content in other parts of the dashboard to be updated immediately.

The content is stored in a global RDF graph store, to which quads are added or removed both  within an app and as a result of web requests. 

What API should PodOS elements use to receive and apply changes to the RDF graph store?


## Decision Drivers

- Performance: re-rendering UX should be smooth and efficient, avoiding unnecessary updates
- Integration: Solution needs to be compatible with [rdflib.js](https://github.com/pod-os/PodOS/blob/main/docs/decisions/0003-handle-data-with-rdflibjs.md) `IndexedFormula` and [Stencil](https://github.com/pod-os/PodOS/blob/main/docs/decisions/0001-use-stenciljs-and-ionic-for-components.md), with [core logic isolated to PodOS core](https://github.com/pod-os/PodOS/blob/main/docs/decisions/0002-separate-pod-os-elements-and-core.md)
- DX: Behaviour should be predictable, with minimal boilerplate required 
- Minimise new dependencies and code size


## Considered Options

- Setting Stencil state from PodOS core rxjs observables 
- Encapsulating reactivity within, e.g. a stencil-store ([example](https://github.com/pod-os/PodOS/issues/37#issuecomment-2493541299))
- Values from Thing methods exposed as [signals](https://github.com/pod-os/PodOS/issues/37#issuecomment-2890892240)
- Shape-based JS object triggered by quad matches, as in [LDO](https://github.com/pod-os/PodOS/issues/37#issuecomment-2493640031)
- Reactive queries, as in [solid-rdf-store](https://github.com/uvdsl/solid-rdf-store/tree/main?tab=readme-ov-file#vue-example-with-reactivity)
- An explicit view model, as in [SemanticKO](https://web.archive.org/web/20111118042156/http://antoniogarrote.com/semantic_ko/)

## Decision Outcome

Chosen option: "Setting Stencil state from PodOS core rxjs observables", because it provides a separation of concerns - UI reactivity is managed by Stencil and the developer of an element explicitly connects the Stencil component state to a stream of changes from the graph store, filtered within PodOS core.


### Positive Consequences

- The nature of the global graph store means that state changes are intuitively modelled as  a sequence of events, which rxjs is designed to efficiently filter
- Avoids handling re-rendering, delegating instead to existing Stencil state management
- Explicit representation of streams helps a developer to reason about how state will change in response to a sequence of changes
- Encapsulates filtering of events within PodOS core, which allows optimisation of individual observables
- PodOS core provides a range of optimised low level and higher level methods that a developer can use without specifying an explicit query or shape
- Builds on the previous decision to [introduce rxjs](https://github.com/pod-os/PodOS/blob/main/docs/decisions/0009-introduce-rxjs.md), avoiding new dependencies 
- rxjs is a well-established library and reactive paradigm, giving confidence in stability and resources for developers

### Negative Consequences

- All PodOS core `Thing` and `Store` methods need new observable implementations, with custom filters
- For PodOS elements to be reactive they need to be modified to use the new observable methods
- Re-rendering behaviour is controlled by and limited to what Stencil offers
- Some boilerplate is introduced: Observables need to be explicitly subscribed and unsubscribed, along with assignment to state happening in the subscribe function.
- The global graph store and stream of quads may lead to performance issues, which may require further optimisation
- Some types of query or shape may need new observables to be implemented, e.g. through modules
