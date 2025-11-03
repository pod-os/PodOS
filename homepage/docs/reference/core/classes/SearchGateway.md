[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / SearchGateway

# Class: SearchGateway

Defined in: [search/SearchGateway.ts:9](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/search/SearchGateway.ts#L9)

## Constructors

### Constructor

> **new SearchGateway**(`store`): `SearchGateway`

Defined in: [search/SearchGateway.ts:10](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/search/SearchGateway.ts#L10)

#### Parameters

##### store

[`Store`](Store.md)

#### Returns

`SearchGateway`

## Methods

### addToLabelIndex()

> **addToLabelIndex**(`thing`, `labelIndex`): `Promise`\<`void`\>

Defined in: [search/SearchGateway.ts:28](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/search/SearchGateway.ts#L28)

#### Parameters

##### thing

[`Thing`](Thing.md)

##### labelIndex

[`LabelIndex`](LabelIndex.md)

#### Returns

`Promise`\<`void`\>

***

### buildSearchIndex()

> **buildSearchIndex**(`profile`): `Promise`\<[`SearchIndex`](SearchIndex.md)\>

Defined in: [search/SearchGateway.ts:16](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/search/SearchGateway.ts#L16)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [search/SearchGateway.ts:32](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/search/SearchGateway.ts#L32)

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`LabelIndex`](LabelIndex.md)\>
