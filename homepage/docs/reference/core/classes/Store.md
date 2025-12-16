[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Store

# Class: Store

Defined in: [Store.ts:39](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L39)

The Store contains all data that is known locally.
It can be used to fetch additional data from the web and also update data and sync it back to editable resources.

## Constructors

### Constructor

> **new Store**(`session`, `offlineCache`, `onlineStatus`, `internalStore`): `Store`

Defined in: [Store.ts:45](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L45)

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

Defined in: [Store.ts:42](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L42)

***

### removals$

> **removals$**: `Subject`\<`Quad`\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [Store.ts:43](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L43)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [Store.ts:124](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L124)

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

Defined in: [Store.ts:106](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L106)

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

Defined in: [Store.ts:151](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L151)

#### Parameters

##### operation

`UpdateOperation`

#### Returns

`Promise`\<`void`\>

***

### fetch()

> **fetch**(`uri`): `Promise`\<`Response`\>

Defined in: [Store.ts:69](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L69)

Fetch data for the given URI to the internalStore

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [Store.ts:86](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L86)

Fetch all the given URIs in parallel and put the data to the internalStore

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### findMembers()

> **findMembers**(`classUri`): `string`[]

Defined in: [Store.ts:172](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L172)

Finds instances of the given class or its sub-classes

#### Parameters

##### classUri

`string`

#### Returns

`string`[]

An array of URIs

***

### flagAuthorizationMetadata()

> **flagAuthorizationMetadata**(): `void`

Defined in: [Store.ts:155](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L155)

#### Returns

`void`

***

### get()

> **get**(`uri`): [`Thing`](Thing.md)

Defined in: [Store.ts:95](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L95)

Retrieve the thing identified by the given URI from the internalStore

#### Parameters

##### uri

`string`

#### Returns

[`Thing`](Thing.md)

***

### loadModule()

> **loadModule**\<`T`\>(`module`): `T`

Defined in: [Store.ts:159](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L159)

#### Type Parameters

##### T

`T`

#### Parameters

##### module

[`PodOsModule`](../interfaces/PodOsModule.md)\<`T`\>

#### Returns

`T`

***

### observeFindMembers()

> **observeFindMembers**(`classUri`): `Observable`\<`string`[]\>

Defined in: [Store.ts:181](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/Store.ts#L181)

Get an Observable that will push new results from [findMembers](#findmembers) when it changes

#### Parameters

##### classUri

`string`

#### Returns

`Observable`\<`string`[]\>

Observable that pushes an array of URIs of instances of the given class or its sub-classes
