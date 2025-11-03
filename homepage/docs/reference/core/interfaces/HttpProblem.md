[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / HttpProblem

# Interface: HttpProblem

Defined in: [problems/index.ts:15](https://github.com/pod-os/PodOS/blob/b4172200853c8560e232f709e37ef34147eba6d7/core/src/problems/index.ts#L15)

Roughly resembling RFC 7807 Problem Details
https://datatracker.ietf.org/doc/html/rfc7807

## Extends

- [`Problem`](Problem.md)

## Properties

### detail?

> `optional` **detail**: `string`

Defined in: [problems/index.ts:8](https://github.com/pod-os/PodOS/blob/b4172200853c8560e232f709e37ef34147eba6d7/core/src/problems/index.ts#L8)

#### Inherited from

[`Problem`](Problem.md).[`detail`](Problem.md#detail)

***

### status

> **status**: `number`

Defined in: [problems/index.ts:17](https://github.com/pod-os/PodOS/blob/b4172200853c8560e232f709e37ef34147eba6d7/core/src/problems/index.ts#L17)

***

### title

> **title**: `string`

Defined in: [problems/index.ts:7](https://github.com/pod-os/PodOS/blob/b4172200853c8560e232f709e37ef34147eba6d7/core/src/problems/index.ts#L7)

#### Inherited from

[`Problem`](Problem.md).[`title`](Problem.md#title)

***

### type

> **type**: `"http"`

Defined in: [problems/index.ts:16](https://github.com/pod-os/PodOS/blob/b4172200853c8560e232f709e37ef34147eba6d7/core/src/problems/index.ts#L16)

#### Overrides

[`Problem`](Problem.md).[`type`](Problem.md#type)
