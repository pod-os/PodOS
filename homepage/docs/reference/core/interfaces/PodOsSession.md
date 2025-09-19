[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOsSession

# Interface: PodOsSession

Defined in: [authentication/index.ts:13](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/authentication/index.ts#L13)

## Properties

### authenticatedFetch

> **authenticatedFetch**: [`AuthenticatedFetch`](../type-aliases/AuthenticatedFetch.md)

Defined in: [authentication/index.ts:14](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/authentication/index.ts#L14)

***

### login()

> **login**: (`oidcIssuer`) => `Promise`\<`void`\>

Defined in: [authentication/index.ts:16](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/authentication/index.ts#L16)

#### Parameters

##### oidcIssuer

`string`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**: () => `Promise`\<`void`\>

Defined in: [authentication/index.ts:17](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/authentication/index.ts#L17)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**: () => `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [authentication/index.ts:15](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/authentication/index.ts#L15)

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>
