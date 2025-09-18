[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / OfflineCapableFetcher

# Class: OfflineCapableFetcher

Defined in: [offline-cache/OfflineCapableFetcher.ts:20](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/offline-cache/OfflineCapableFetcher.ts#L20)

## Extends

- `Fetcher`

## Constructors

### Constructor

> **new OfflineCapableFetcher**(`store`, `options`): `OfflineCapableFetcher`

Defined in: [offline-cache/OfflineCapableFetcher.ts:25](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/offline-cache/OfflineCapableFetcher.ts#L25)

#### Parameters

##### store

`IndexedFormula`

##### options

`Partial`\<`AutoInitOptions`\> & `OfflineCapableFetcherOptions`

#### Returns

`OfflineCapableFetcher`

#### Overrides

`Fetcher.constructor`

## Methods

### load()

#### Call Signature

> **load**(`uri`, `options?`): `Promise`\<`Response`\>

Defined in: [offline-cache/OfflineCapableFetcher.ts:36](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/offline-cache/OfflineCapableFetcher.ts#L36)

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

Defined in: [offline-cache/OfflineCapableFetcher.ts:40](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/offline-cache/OfflineCapableFetcher.ts#L40)

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

Defined in: [offline-cache/OfflineCapableFetcher.ts:44](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/offline-cache/OfflineCapableFetcher.ts#L44)

##### Parameters

###### uri

(`string` \| `NamedNode`)[]

###### options?

`Partial`\<`AutoInitOptions`\>

##### Returns

`Promise`\<`Response`[]\>

##### Overrides

`Fetcher.load`
