# PodOS Code Style

## API Design

### Prerequisites are neither optional nor a promise

When a unit depends on another object as a prerequisite, accept it as a
required, synchronous parameter. Callers resolve it before use — typically
once at the component boundary. Optional parameters or promises that might
never resolve spread uncertainty into every consumer.

### Build expensive things once, at configuration time

Construct expensive resources when the consumer is configured, not on every
operation — even if an internal cache makes repeated builds cheap. Pin such
invariants with a regression test.

## Module Design

### Extract functions for their own testability, not only for reuse

Extracting a function into its own module is worthwhile even if it is used
only once: a pure function can be unit tested in isolation, and its callers
no longer need to reach into internals.
