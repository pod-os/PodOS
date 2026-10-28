[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Store

# Class: Store

Defined in: [src/Store.ts:54](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L54)

The Store contains all data that is known locally.
It can be used to fetch additional data from the web and also update data and sync it back to editable resources.

## Constructors

### Constructor

> **new Store**(`session`, `offlineCache?`, `onlineStatus?`, `internalStore?`): `Store`

Defined in: [src/Store.ts:62](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L62)

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

> **additions$**: `Subject`\<[`Quad`](../interfaces/Quad.md)\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [src/Store.ts:57](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L57)

***

### DESCRIBEDBY

> `readonly` **DESCRIBEDBY**: `NamedNode`

Defined in: [src/Store.ts:83](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L83)

***

### removals$

> **removals$**: `Subject`\<[`Quad`](../interfaces/Quad.md)\<`Quad_Subject`, `Quad_Predicate`, `Quad_Object`, `Quad_Graph`\>\>

Defined in: [src/Store.ts:58](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L58)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type?`): `Promise`\<`void`\>

Defined in: [src/Store.ts:220](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L220)

#### Parameters

##### uri

`string`

##### name

`string`

##### type?

`string`

#### Returns

`Promise`\<`void`\>

***

### addPropertyValue()

> **addPropertyValue**(`thing`, `property`, `value`): `Promise`\<`void`\>

Defined in: [src/Store.ts:147](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L147)

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

### addRelation()

> **addRelation**(`thing`, `property`, `uri`): `Promise`\<`void`\>

Defined in: [src/Store.ts:201](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L201)

Adds a new relation (link) from the thing to the given uri using the property

#### Parameters

##### thing

[`Thing`](Thing.md)

##### property

`string`

##### uri

`string`

#### Returns

`Promise`\<`void`\>

***

### any()

> **any**(`subject?`, `predicate?`, `object?`, `graph?`): `Term` \| `null`

Defined in: [src/Store.ts:387](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L387)

Any one RDF/JS term matching the first wildcard in the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` \| `null`

##### predicate?

`Quad_Predicate` \| `null`

##### object?

`Quad_Object` \| `null`

##### graph?

`Quad_Graph` \| `null`

#### Returns

`Term` \| `null`

RDF/JS term

***

### anyValue()

> **anyValue**(`subject?`, `predicate?`, `object?`, `graph?`): `string` \| `undefined`

Defined in: [src/Store.ts:423](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L423)

Value of any one RDF/JS term matching the first wildcard in the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` \| `null`

##### predicate?

`Quad_Predicate` \| `null`

##### object?

`Quad_Object` \| `null`

##### graph?

`Quad_Graph` \| `null`

#### Returns

`string` \| `undefined`

value of RDF/JS term

***

### each()

> **each**(`subject?`, `predicate?`, `object?`, `graph?`): `Term`[]

Defined in: [src/Store.ts:354](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L354)

RDF/JS terms matching the first wildcard in the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` \| `null`

##### predicate?

`Quad_Predicate` \| `null`

##### object?

`Quad_Object` \| `null`

##### graph?

`Quad_Graph` \| `null`

#### Returns

`Term`[]

Array of terms

***

### editPropertyValue()

> **editPropertyValue**(`thing`, `property`, `oldValue`, `newValue`): `Promise`\<`void`\>

Defined in: [src/Store.ts:161](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L161)

Updates the value of the given property of the given thing to the new value

#### Parameters

##### thing

[`Thing`](Thing.md)

##### property

`string`

##### oldValue

`string`

##### newValue

`string`

#### Returns

`Promise`\<`void`\>

***

### executeUpdate()

> **executeUpdate**(`operation`): `Promise`\<`void`\>

Defined in: [src/Store.ts:248](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L248)

#### Parameters

##### operation

`UpdateOperation`

#### Returns

`Promise`\<`void`\>

***

### fetch()

> **fetch**(`uri`): `Promise`\<`void`\>

Defined in: [src/Store.ts:91](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L91)

Fetch data for the given URI to the internalStore.
If the response includes a Link header with rel="describedby",
the metadata document will also be fetched automatically.

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`void`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`void`\>[]\>

Defined in: [src/Store.ts:127](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L127)

Fetch all the given URIs in parallel and put the data to the internalStore

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`void`\>[]\>

***

### findMembers()

> **findMembers**(`classUri`): `string`[]

Defined in: [src/Store.ts:269](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L269)

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

Defined in: [src/Store.ts:299](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L299)

Finds types of the given resource

#### Parameters

##### uri

`string` \| `NamedNode` \| `BlankNode`

String or RDF/JS object

#### Returns

`string`[]

An array of URIs of types

***

### flagAuthorizationMetadata()

> **flagAuthorizationMetadata**(): `void`

Defined in: [src/Store.ts:252](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L252)

#### Returns

`void`

***

### get()

> **get**(`uri`): [`Thing`](Thing.md)

Defined in: [src/Store.ts:136](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L136)

Retrieve the thing identified by the given URI from the internalStore

#### Parameters

##### uri

`string`

#### Returns

[`Thing`](Thing.md)

***

### holds()

> **holds**(`subject?`, `predicate?`, `object?`, `graph?`): `boolean`

Defined in: [src/Store.ts:313](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L313)

Determines whether the store includes a certain quad pattern, returning true or false as appropriate.

#### Parameters

##### subject?

`Quad_Subject` \| `null`

##### predicate?

`Quad_Predicate` \| `null`

##### object?

`Quad_Object` \| `null`

##### graph?

`Quad_Graph` \| `null`

#### Returns

`boolean`

Whether the store includes the quad pattern

***

### loadModule()

> **loadModule**\<`T`\>(`module`): `T`

Defined in: [src/Store.ts:256](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L256)

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

Defined in: [src/Store.ts:278](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L278)

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

Defined in: [src/Store.ts:440](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L440)

Create a query to fetch information from a user's preferences file

#### Parameters

##### webId

`string` \| `NamedNode`

##### preferencesDoc

`string` \| `NamedNode`

#### Returns

`PreferencesQuery`

PreferencesQuery instance. See [@solid-data-modules/rdflib-utils
](https://solid-contrib.github.io/data-modules/rdflib-utils/classes/index.PreferencesQuery.html)

***

### profileQuery()

> **profileQuery**(`webId`): `ProfileQuery`

Defined in: [src/Store.ts:457](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L457)

Create a query to fetch information from a user's profile document

#### Parameters

##### webId

`string` \| `NamedNode`

#### Returns

`ProfileQuery`

ProfileQuery instance. See [@solid-data-modules/rdflib-utils
](https://solid-contrib.github.io/data-modules/rdflib-utils/classes/index.ProfileQuery.html)

***

### statementsMatching()

> **statementsMatching**(`subject?`, `predicate?`, `object?`, `graph?`): `Statement`\<`SubjectType`, `PredicateType`, `ObjectType`, `GraphType`\>[]

Defined in: [src/Store.ts:331](https://github.com/pod-os/PodOS/blob/main/core/src/Store.ts#L331)

Statements matching the provided quad pattern

#### Parameters

##### subject?

`Quad_Subject` \| `null`

##### predicate?

`Quad_Predicate` \| `null`

##### object?

`Quad_Object` \| `null`

##### graph?

`Quad_Graph` \| `null`

#### Returns

`Statement`\<`SubjectType`, `PredicateType`, `ObjectType`, `GraphType`\>[]

Array of statements
