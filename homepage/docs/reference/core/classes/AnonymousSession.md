[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / AnonymousSession

# Class: AnonymousSession

Defined in: [authentication/index.ts:20](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/authentication/index.ts#L20)

## Implements

- [`PodOsSession`](../interfaces/PodOsSession.md)

## Constructors

### Constructor

> **new AnonymousSession**(): `AnonymousSession`

#### Returns

`AnonymousSession`

## Accessors

### authenticatedFetch

#### Get Signature

> **get** **authenticatedFetch**(): (`url`, `init?`) => `Promise`\<`Response`\>

Defined in: [authentication/index.ts:27](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/authentication/index.ts#L27)

##### Returns

> (`url`, `init?`): `Promise`\<`Response`\>

###### Parameters

###### url

`RequestInfo`

###### init?

`RequestInit`

###### Returns

`Promise`\<`Response`\>

#### Implementation of

[`PodOsSession`](../interfaces/PodOsSession.md).[`authenticatedFetch`](../interfaces/PodOsSession.md#authenticatedfetch)

## Methods

### login()

> **login**(): `Promise`\<`void`\>

Defined in: [authentication/index.ts:38](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/authentication/index.ts#L38)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`PodOsSession`](../interfaces/PodOsSession.md).[`login`](../interfaces/PodOsSession.md#login)

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [authentication/index.ts:42](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/authentication/index.ts#L42)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`PodOsSession`](../interfaces/PodOsSession.md).[`logout`](../interfaces/PodOsSession.md#logout)

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [authentication/index.ts:34](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/authentication/index.ts#L34)

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

#### Implementation of

[`PodOsSession`](../interfaces/PodOsSession.md).[`observeSession`](../interfaces/PodOsSession.md#observesession)
