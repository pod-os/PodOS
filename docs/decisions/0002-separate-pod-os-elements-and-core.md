# Separate PodOS elements and core

## Context and Problem Statement

The PodOS elements rely on Solid core logic to read and operate on data. This
core logic should not only be usable by web frontends, but also in other
contexts, like backend servers, command-line tools and more.

The core logic needs to do processing of RDF data, which heavily relies on
Node.js core (streams, buffer etc.). This does not work well with the StencilJS
build process.

## Decision Outcome

Split PodOS elements and PodOS core into two separate packages. PodOS elements
depend on core, but not the other way around.

PodOS core will be bundled independently of PodOS elements.

Since the first use cas es of PodOS will be browser apps, PodOS core can contain
browser specific code for now (like authentication via redirect), but it needs
to possible to split it apart easily later on.

### Positive Consequences

- PodOS elements can use the modern StencilJS build process based on es modules
- PodOS core can be bundled with all needed node polyfills

### Negative Consequences

- Web applications need to import both PodOS core and PodOS elements
- PodOS elements needs to rely on some global variable to access the core
  functions
