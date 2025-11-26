[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / OfflineCache

# Interface: OfflineCache

Defined in: [offline-cache/OfflineCache.ts:7](https://github.com/pod-os/PodOS/blob/03b667361962bb6efdcf728fe7a8b99cb6805d41/core/src/offline-cache/OfflineCache.ts#L7)

## Methods

### clear()

> **clear**(): `void`

Defined in: [offline-cache/OfflineCache.ts:10](https://github.com/pod-os/PodOS/blob/03b667361962bb6efdcf728fe7a8b99cb6805d41/core/src/offline-cache/OfflineCache.ts#L10)

#### Returns

`void`

***

### get()

> **get**(`url`): `Promise`\<[`CachedRdfDocument`](CachedRdfDocument.md) \| `undefined`\>

Defined in: [offline-cache/OfflineCache.ts:9](https://github.com/pod-os/PodOS/blob/03b667361962bb6efdcf728fe7a8b99cb6805d41/core/src/offline-cache/OfflineCache.ts#L9)

#### Parameters

##### url

`string`

#### Returns

`Promise`\<[`CachedRdfDocument`](CachedRdfDocument.md) \| `undefined`\>

***

### put()

> **put**(`document`): `void`

Defined in: [offline-cache/OfflineCache.ts:8](https://github.com/pod-os/PodOS/blob/03b667361962bb6efdcf728fe7a8b99cb6805d41/core/src/offline-cache/OfflineCache.ts#L8)

#### Parameters

##### document

[`CachedRdfDocument`](CachedRdfDocument.md)

#### Returns

`void`
