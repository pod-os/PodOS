# Introduce RxJS

## Context and Problem Statement

For other apps (like PodOS contacts, but also third-party apps) it was not possible to get the current user session. There is a way to get notified about session changes via `trackSession`, but this will not be sufficient if the session state does not change and the app just needs the current session state.

## Considered Options

- use RxJS
- make the session info globally available

## Decision Outcome

- use a RxJS BehaviourSubject to stream all session values to interested subscribers

### Positive Consequences

- current and future session values are communicated the same way
- RxJS might come in handy in other places where applications need to react to state changes, like when new data for a resource gets fetched

### Negative Consequences

- new dependency on RxJS
- handling subscribe and unsubscribe can be complex and error-prone

## Links

- [RxJS](https://rxjs.dev/)

