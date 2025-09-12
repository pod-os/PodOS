[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:38](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L38)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters`): `PodOS`

Defined in: [index.ts:46](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L46)

#### Parameters

##### \_\_namedParameters

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: `Store`

Defined in: [index.ts:40](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L40)

***

### uriService

> `readonly` **uriService**: `UriService`

Defined in: [index.ts:41](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L41)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:108](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L108)

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

Defined in: [index.ts:96](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L96)

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

### addToLabelIndex()

> **addToLabelIndex**(`thing`, `labelIndex`): `Promise`\<`void`\>

Defined in: [index.ts:163](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L163)

Adds a label of the given thing to the label index, so that it can be found after the search index has been rebuilt

#### Parameters

##### thing

[`Thing`](Thing.md)

The thing to index

##### labelIndex

[`LabelIndex`](LabelIndex.md)

The index to update

#### Returns

`Promise`\<`void`\>

***

### buildSearchIndex()

> **buildSearchIndex**(`profile`): `Promise`\<[`SearchIndex`](SearchIndex.md)\>

Defined in: [index.ts:141](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L141)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:173](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L173)

Creates a new label index document at a default location and links it to the user's profile or preferences document

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

The profile for that to create the index

#### Returns

`Promise`\<[`LabelIndex`](LabelIndex.md)\>

the newly created label index

***

### fetch()

> **fetch**(`uri`): `Promise`\<`Response`\>

Defined in: [index.ts:84](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L84)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:88](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L88)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### fetchFile()

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:92](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L92)

#### Parameters

##### url

`string`

#### Returns

`Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

***

### fetchProfile()

> **fetchProfile**(`webId`): `Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

Defined in: [index.ts:127](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L127)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:104](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L104)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadContactsModule()

> **loadContactsModule**(): `Promise`\<`ContactsModule`\>

Defined in: [index.ts:154](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L154)

#### Returns

`Promise`\<`ContactsModule`\>

***

### login()

> **login**(`oidcIssuer`): `Promise`\<`void`\>

Defined in: [index.ts:150](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L150)

#### Parameters

##### oidcIssuer

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:145](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L145)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:119](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L119)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [index.ts:112](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/index.ts#L112)

#### Parameters

##### referenceUri

`string`

##### name

`string`

#### Returns

`string`
