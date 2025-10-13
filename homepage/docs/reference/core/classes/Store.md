[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Store

# Class: Store

Defined in: [Store.ts:29](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L29)

The internalStore contains all data that is known locally.
It can be used to fetch additional data from the web and also update data and sync it back to editable resources.

## Constructors

### Constructor

> **new Store**(`session`, `offlineCache`, `onlineStatus`, `internalStore`): `Store`

Defined in: [Store.ts:33](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L33)

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

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [Store.ts:106](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L106)

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

Defined in: [Store.ts:88](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L88)

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

Defined in: [Store.ts:133](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L133)

#### Parameters

##### operation

`UpdateOperation`

#### Returns

`Promise`\<`void`\>

***

### fetch()

> **fetch**(`uri`): `Promise`\<`Response`\>

Defined in: [Store.ts:51](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L51)

Fetch data for the given URI to the internalStore

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [Store.ts:68](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L68)

Fetch all the given URIs in parallel and put the data to the internalStore

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### flagAuthorizationMetadata()

> **flagAuthorizationMetadata**(): `void`

Defined in: [Store.ts:137](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L137)

#### Returns

`void`

***

### get()

> **get**(`uri`): [`Thing`](Thing.md)

Defined in: [Store.ts:77](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L77)

Retrieve the thing identified by the given URI from the internalStore

#### Parameters

##### uri

`string`

#### Returns

[`Thing`](Thing.md)

***

### loadModule()

> **loadModule**\<`T`\>(`module`): `T`

Defined in: [Store.ts:141](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/Store.ts#L141)

#### Type Parameters

##### T

`T`

#### Parameters

##### module

[`PodOsModule`](../interfaces/PodOsModule.md)\<`T`\>

#### Returns

`T`
