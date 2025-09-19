[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:40](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L40)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters`): `PodOS`

Defined in: [index.ts:48](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L48)

#### Parameters

##### \_\_namedParameters

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [index.ts:42](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L42)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [index.ts:43](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L43)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:110](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L110)

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

Defined in: [index.ts:98](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L98)

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

Defined in: [index.ts:165](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L165)

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

Defined in: [index.ts:143](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L143)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:175](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L175)

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

Defined in: [index.ts:86](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L86)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:90](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L90)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### fetchFile()

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:94](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L94)

#### Parameters

##### url

`string`

#### Returns

`Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

***

### fetchProfile()

> **fetchProfile**(`webId`): `Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

Defined in: [index.ts:129](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L129)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:106](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L106)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadContactsModule()

> **loadContactsModule**(): `Promise`\<`ContactsModule`\>

Defined in: [index.ts:156](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L156)

#### Returns

`Promise`\<`ContactsModule`\>

***

### login()

> **login**(`oidcIssuer`): `Promise`\<`void`\>

Defined in: [index.ts:152](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L152)

#### Parameters

##### oidcIssuer

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:147](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L147)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:121](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L121)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [index.ts:114](https://github.com/pod-os/PodOS/blob/5f8057b37a40843b32a1365a54e4283e9f14e36c/core/src/index.ts#L114)

#### Parameters

##### referenceUri

`string`

##### name

`string`

#### Returns

`string`
