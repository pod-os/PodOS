[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Store

# Class: Store

Defined in: [Store.ts:51](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L51)

The Store contains all data that is known locally.
It can be used to fetch additional data from the web and also update data and sync it back to editable resources.

## Constructors

### Constructor

> **new Store**(`session`, `offlineCache?`, `onlineStatus?`, `internalStore?`): `Store`

Defined in: [Store.ts:57](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L57)

#### Parameters

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

##### offlineCache?

[`OfflineCache`](../interfaces/OfflineCache.md) = `...`

##### onlineStatus?

[`OnlineStatus`](../interfaces/OnlineStatus.md) = `...`

##### internalStore?

`IndexedFormula` = `...`

#### Returns

`Store`

## Properties

### additions$

> **additions$**: `Subject`\<`Quad`\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [Store.ts:54](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L54)

***

### removals$

> **removals$**: `Subject`\<`Quad`\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [Store.ts:55](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L55)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [Store.ts:136](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L136)

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

Defined in: [Store.ts:118](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L118)

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

### any()

> **any**(`subject?`, `predicate?`, `object?`, `graph?`): `Term` \| `null`

Defined in: [Store.ts:302](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L302)

Any one RDF/JS term matching the first wildcard in the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` | `null`

##### predicate?

`Quad_Predicate` | `null`

##### object?

`Quad_Object` | `null`

##### graph?

`Quad_Graph` | `null`

#### Returns

`Term` \| `null`

RDF/JS term

***

### anyValue()

> **anyValue**(`subject?`, `predicate?`, `object?`, `graph?`): `string` \| `undefined`

Defined in: [Store.ts:338](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L338)

Value of any one RDF/JS term matching the first wildcard in the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` | `null`

##### predicate?

`Quad_Predicate` | `null`

##### object?

`Quad_Object` | `null`

##### graph?

`Quad_Graph` | `null`

#### Returns

`string` \| `undefined`

value of RDF/JS term

***

### each()

> **each**(`subject?`, `predicate?`, `object?`, `graph?`): `Term`[]

Defined in: [Store.ts:269](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L269)

RDF/JS terms matching the first wildcard in the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` | `null`

##### predicate?

`Quad_Predicate` | `null`

##### object?

`Quad_Object` | `null`

##### graph?

`Quad_Graph` | `null`

#### Returns

`Term`[]

Array of terms

***

### executeUpdate()

> **executeUpdate**(`operation`): `Promise`\<`void`\>

Defined in: [Store.ts:163](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L163)

#### Parameters

##### operation

`UpdateOperation`

#### Returns

`Promise`\<`void`\>

***

### fetch()

> **fetch**(`uri`): `Promise`\<`Response`\>

Defined in: [Store.ts:81](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L81)

Fetch data for the given URI to the internalStore

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [Store.ts:98](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L98)

Fetch all the given URIs in parallel and put the data to the internalStore

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### findMembers()

> **findMembers**(`classUri`): `string`[]

Defined in: [Store.ts:184](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L184)

Finds instances of the given class or its sub-classes

#### Parameters

##### classUri

`string`

#### Returns

`string`[]

An array of URIs

***

### findTypes()

> **findTypes**(`uri`): `string`[]

Defined in: [Store.ts:214](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L214)

Finds types of the given resource

#### Parameters

##### uri

String or RDF/JS object

`string` | `NamedNode` | `BlankNode`

#### Returns

`string`[]

An array of URIs of types

***

### flagAuthorizationMetadata()

> **flagAuthorizationMetadata**(): `void`

Defined in: [Store.ts:167](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L167)

#### Returns

`void`

***

### get()

> **get**(`uri`): [`Thing`](Thing.md)

Defined in: [Store.ts:107](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L107)

Retrieve the thing identified by the given URI from the internalStore

#### Parameters

##### uri

`string`

#### Returns

[`Thing`](Thing.md)

***

### holds()

> **holds**(`subject?`, `predicate?`, `object?`, `graph?`): `boolean`

Defined in: [Store.ts:228](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L228)

Determines whether the store includes a certain quad pattern, returning true or false as appropriate.

#### Parameters

##### subject?

`Quad_Subject` | `null`

##### predicate?

`Quad_Predicate` | `null`

##### object?

`Quad_Object` | `null`

##### graph?

`Quad_Graph` | `null`

#### Returns

`boolean`

Whether the store includes the quad pattern

***

### loadModule()

> **loadModule**\<`T`\>(`module`): `T`

Defined in: [Store.ts:171](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L171)

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

Defined in: [Store.ts:193](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L193)

Get an Observable that will push new results from [findMembers](#findmembers) when it changes

#### Parameters

##### classUri

`string`

#### Returns

`Observable`\<`string`[]\>

Observable that pushes an array of URIs of instances of the given class or its sub-classes

***

### preferencesQuery()

> **preferencesQuery**(`webId`, `preferencesDoc`): `PreferencesQuery`

Defined in: [Store.ts:355](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L355)

Create a query to fetch information from a user's preferences file

#### Parameters

##### webId

`string` | `NamedNode`

##### preferencesDoc

`string` | `NamedNode`

#### Returns

`PreferencesQuery`

PreferencesQuery instance. See [@solid-data-modules/rdflib-utils
](https://solid-contrib.github.io/data-modules/rdflib-utils/classes/index.PreferencesQuery.html)

***

### profileQuery()

> **profileQuery**(`webId`): `ProfileQuery`

Defined in: [Store.ts:372](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L372)

Create a query to fetch information from a user's profile document

#### Parameters

##### webId

`string` | `NamedNode`

#### Returns

`ProfileQuery`

ProfileQuery instance. See [@solid-data-modules/rdflib-utils
](https://solid-contrib.github.io/data-modules/rdflib-utils/classes/index.ProfileQuery.html)

***

### statementsMatching()

> **statementsMatching**(`subject?`, `predicate?`, `object?`, `graph?`): `Statement`\<`SubjectType`, `PredicateType`, `ObjectType`, `GraphType`\>[]

Defined in: [Store.ts:246](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L246)

Statements matching the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` | `null`

##### predicate?

`Quad_Predicate` | `null`

##### object?

`Quad_Object` | `null`

##### graph?

`Quad_Graph` | `null`

#### Returns

`Statement`\<`SubjectType`, `PredicateType`, `ObjectType`, `GraphType`\>[]

Array of statements
