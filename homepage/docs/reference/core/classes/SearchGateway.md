[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / SearchGateway

# Class: SearchGateway

Defined in: [src/search/SearchGateway.ts:12](https://github.com/pod-os/PodOS/blob/main/core/src/search/SearchGateway.ts#L12)

## Constructors

### Constructor

> **new SearchGateway**(`store`, `session`, `profileGateway`): `SearchGateway`

Defined in: [src/search/SearchGateway.ts:18](https://github.com/pod-os/PodOS/blob/main/core/src/search/SearchGateway.ts#L18)

#### Parameters

##### store

[`Store`](Store.md)

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

##### profileGateway

[`ProfileGateway`](ProfileGateway.md)

#### Returns

`SearchGateway`

## Methods

### addToLabelIndex()

> **addToLabelIndex**(`thing`, `labelIndex`): `Promise`\<`void`\>

Defined in: [src/search/SearchGateway.ts:78](https://github.com/pod-os/PodOS/blob/main/core/src/search/SearchGateway.ts#L78)

#### Parameters

##### thing

[`Thing`](Thing.md)

##### labelIndex

[`LabelIndex`](LabelIndex.md)

#### Returns

`Promise`\<`void`\>

***

### buildSearchIndex()

> **buildSearchIndex**(): `Promise`\<[`SearchIndex`](SearchIndex.md)\>

Defined in: [src/search/SearchGateway.ts:38](https://github.com/pod-os/PodOS/blob/main/core/src/search/SearchGateway.ts#L38)

Build a search index on demand.

While logged in, the profile is resolved from the current session's webId
and the index is built from the profile's label indexes and cached, so that
repeated calls return the same instance.

While logged out, a fresh empty index is returned that is NOT cached —
the next call after login is a cache miss and builds.

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### clear()

> **clear**(): `void`

Defined in: [src/search/SearchGateway.ts:59](https://github.com/pod-os/PodOS/blob/main/core/src/search/SearchGateway.ts#L59)

Empties the cached search index in place and drops the cache reference, so
that consumers already holding the instance see an empty index immediately
and the next call to [buildSearchIndex](#buildsearchindex) builds a new index.

#### Returns

`void`

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [src/search/SearchGateway.ts:85](https://github.com/pod-os/PodOS/blob/main/core/src/search/SearchGateway.ts#L85)

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`LabelIndex`](LabelIndex.md)\>
