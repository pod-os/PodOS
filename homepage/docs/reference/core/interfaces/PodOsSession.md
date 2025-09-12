[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOsSession

# Interface: PodOsSession

Defined in: [authentication/index.ts:13](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/authentication/index.ts#L13)

## Properties

### authenticatedFetch

> **authenticatedFetch**: [`AuthenticatedFetch`](../type-aliases/AuthenticatedFetch.md)

Defined in: [authentication/index.ts:14](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/authentication/index.ts#L14)

***

### login()

> **login**: (`oidcIssuer`) => `Promise`\<`void`\>

Defined in: [authentication/index.ts:16](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/authentication/index.ts#L16)

#### Parameters

##### oidcIssuer

`string`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**: () => `Promise`\<`void`\>

Defined in: [authentication/index.ts:17](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/authentication/index.ts#L17)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**: () => `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [authentication/index.ts:15](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/authentication/index.ts#L15)

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>
