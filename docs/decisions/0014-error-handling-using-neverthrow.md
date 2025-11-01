# Error handling using neverthrow

- Status: accepted
- Deciders: [Angelo Veltens](https://angelo.veltens.org/profile/card#me)

## Context and Problem Statement

Thrown errors and rejected promises do not give any type-safety in TypeScript. This is especially problematic for http
requests which can fail in various ways, e.g., client side errors (4xx status), server side errors (5xx status), CORS
errors or other network errors. Yet in TypeScript the promise is either resolved with a known type or rejected with
something completely unknown, since rejections are not part of the method signature and the type system.

## Considered Options

- accept the problem and continue using idiomatic TypeScript error handling
- use a functional approach using the Result Pattern with neverthrow

## Decision Outcome

We introduce `neverthrow` as a dependency to PodOS core and start using it in newly added functionality. If it proves
 useful, its use could be expanded to existing functionality.

### Positive Consequences

- explicit typing for error cases
- ensures errors are handled explicitly and not forgotten

### Negative Consequences

- adds additional complexity to the code
- it is not the idiomatic way to handle errors in TypeScript
  - might make it harder for new developers 
  - might make it harder to integrate with PodOS

## Links

- [neverthrow](https://www.npmjs.com/package/neverthrow)
- [Introduction: Type Safe Errors in JS & TypeScript](https://github.com/supermacro/neverthrow/wiki/Introduction:-Type-Safe-Errors-in-JS-&-TypeScript-(10-minute-read))