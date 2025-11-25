[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Store

# Class: Store

Defined in: [Store.ts:31](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L31)

The Store contains all data that is known locally.
It can be used to fetch additional data from the web and also update data and sync it back to editable resources.

## Constructors

### Constructor

> **new Store**(`session`, `offlineCache`, `onlineStatus`, `internalStore`): `Store`

Defined in: [Store.ts:37](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L37)

#### Parameters

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

##### offlineCache

[`OfflineCache`](../interfaces/OfflineCache.md) = `...`

##### onlineStatus

[`OnlineStatus`](../interfaces/OnlineStatus.md) = `...`

##### internalStore

`IndexedFormula` = `...`

#### Returns

`Store`

## Properties

### additions$

> **additions$**: `Subject`\<`Quad`\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [Store.ts:34](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L34)

***

### removals$

> **removals$**: `Subject`\<`Quad`\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [Store.ts:35](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L35)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [Store.ts:116](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L116)

#### Parameters

##### uri

`string`

##### name

`string`

##### type

`string`

#### Returns

`Promise`\<`void`\>

***

### addPropertyValue()

> **addPropertyValue**(`thing`, `property`, `value`): `Promise`\<`void`\>

Defined in: [Store.ts:98](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L98)

Adds a new value to the property of the given thing

#### Parameters

##### thing

[`Thing`](Thing.md)

##### property

`string`

##### value

`string`

#### Returns

`Promise`\<`void`\>

***

### executeUpdate()

> **executeUpdate**(`operation`): `Promise`\<`void`\>

Defined in: [Store.ts:143](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L143)

#### Parameters

##### operation

`UpdateOperation`

#### Returns

`Promise`\<`void`\>

***

### fetch()

> **fetch**(`uri`): `Promise`\<`Response`\>

Defined in: [Store.ts:61](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L61)

Fetch data for the given URI to the internalStore

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [Store.ts:78](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L78)

Fetch all the given URIs in parallel and put the data to the internalStore

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### flagAuthorizationMetadata()

> **flagAuthorizationMetadata**(): `void`

Defined in: [Store.ts:147](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L147)

#### Returns

`void`

***

### get()

> **get**(`uri`): [`Thing`](Thing.md)

Defined in: [Store.ts:87](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L87)

Retrieve the thing identified by the given URI from the internalStore

#### Parameters

##### uri

`string`

#### Returns

[`Thing`](Thing.md)

***

### loadModule()

> **loadModule**\<`T`\>(`module`): `T`

Defined in: [Store.ts:151](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/Store.ts#L151)

#### Type Parameters

##### T

`T`

#### Parameters

##### module

[`PodOsModule`](../interfaces/PodOsModule.md)\<`T`\>

#### Returns

`T`
