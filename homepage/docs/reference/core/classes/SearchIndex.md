[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / SearchIndex

# Class: SearchIndex

Defined in: [search/SearchIndex.ts:7](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/search/SearchIndex.ts#L7)

A fast, in-memory search index based on data from label indexes. Both labels and URIs are indexed.

## Constructors

### Constructor

> **new SearchIndex**(`labelIndexes`): `SearchIndex`

Defined in: [search/SearchIndex.ts:9](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/search/SearchIndex.ts#L9)

#### Parameters

##### labelIndexes

[`LabelIndex`](LabelIndex.md)[]

#### Returns

`SearchIndex`

## Methods

### clear()

> **clear**(): `void`

Defined in: [search/SearchIndex.ts:61](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/search/SearchIndex.ts#L61)

Remove all data from the search index.

#### Returns

`void`

***

### rebuild()

> **rebuild**(): `SearchIndex`

Defined in: [search/SearchIndex.ts:16](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/search/SearchIndex.ts#L16)

Recreates the search index with the current data from all label indexes

#### Returns

`SearchIndex`

***

### search()

> **search**(`term`, `maxResults`): `Result`[]

Defined in: [search/SearchIndex.ts:49](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/search/SearchIndex.ts#L49)

Search the index for a given term. It finds partial matches, but will rank exact matches higher.

The rank order is:

 1. exact matches
 2. prefix matches
 3. suffix matches
 4. any matches inside a literal

#### Parameters

##### term

`string`

The (partial) term to search for

##### maxResults

`number` = `10`

The maximum number of results to return (defaults to 10)

#### Returns

`Result`[]
