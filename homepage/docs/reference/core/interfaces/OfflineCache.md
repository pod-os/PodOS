[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / OfflineCache

# Interface: OfflineCache

Defined in: [offline-cache/OfflineCache.ts:7](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCache.ts#L7)

## Methods

### clear()

> **clear**(): `void`

Defined in: [offline-cache/OfflineCache.ts:10](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCache.ts#L10)

#### Returns

`void`

***

### get()

> **get**(`url`): `Promise`\<`undefined` \| [`CachedRdfDocument`](CachedRdfDocument.md)\>

Defined in: [offline-cache/OfflineCache.ts:9](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCache.ts#L9)

#### Parameters

##### url

`string`

#### Returns

`Promise`\<`undefined` \| [`CachedRdfDocument`](CachedRdfDocument.md)\>

***

### put()

> **put**(`document`): `void`

Defined in: [offline-cache/OfflineCache.ts:8](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/offline-cache/OfflineCache.ts#L8)

#### Parameters

##### document

[`CachedRdfDocument`](CachedRdfDocument.md)

#### Returns

`void`
