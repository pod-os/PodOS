[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / OfflineCapableFetcher

# Class: OfflineCapableFetcher

Defined in: [offline-cache/OfflineCapableFetcher.ts:20](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCapableFetcher.ts#L20)

## Extends

- `Fetcher`

## Constructors

### Constructor

> **new OfflineCapableFetcher**(`store`, `options`): `OfflineCapableFetcher`

Defined in: [offline-cache/OfflineCapableFetcher.ts:25](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCapableFetcher.ts#L25)

#### Parameters

##### store

`IndexedFormula`

##### options

`Partial`\<`AutoInitOptions`\> & [`OfflineCapableFetcherOptions`](../interfaces/OfflineCapableFetcherOptions.md)

#### Returns

`OfflineCapableFetcher`

#### Overrides

`Fetcher.constructor`

## Methods

### load()

#### Call Signature

> **load**(`uri`, `options?`): `Promise`\<`Response`\>

Defined in: [offline-cache/OfflineCapableFetcher.ts:36](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCapableFetcher.ts#L36)

##### Parameters

###### uri

`string`

###### options?

`Partial`\<`AutoInitOptions`\>

##### Returns

`Promise`\<`Response`\>

##### Overrides

`Fetcher.load`

#### Call Signature

> **load**(`uri`, `options?`): `Promise`\<`Response`\>

Defined in: [offline-cache/OfflineCapableFetcher.ts:40](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCapableFetcher.ts#L40)

##### Parameters

###### uri

`NamedNode`

###### options?

`Partial`\<`AutoInitOptions`\>

##### Returns

`Promise`\<`Response`\>

##### Overrides

`Fetcher.load`

#### Call Signature

> **load**(`uri`, `options?`): `Promise`\<`Response`[]\>

Defined in: [offline-cache/OfflineCapableFetcher.ts:44](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCapableFetcher.ts#L44)

##### Parameters

###### uri

(`string` \| `NamedNode`)[]

###### options?

`Partial`\<`AutoInitOptions`\>

##### Returns

`Promise`\<`Response`[]\>

##### Overrides

`Fetcher.load`
