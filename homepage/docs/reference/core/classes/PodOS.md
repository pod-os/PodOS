[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [src/index.ts:48](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L48)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters?`): `PodOS`

Defined in: [src/index.ts:60](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L60)

#### Parameters

##### \_\_namedParameters?

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [src/index.ts:50](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L50)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [src/index.ts:51](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L51)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type?`): `Promise`\<`void`\>

Defined in: [src/index.ts:176](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L176)

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

Defined in: [src/index.ts:138](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L138)

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

> **addRelation**(`thing`, `property`, `value`): `Promise`\<`void`\>

Defined in: [src/index.ts:168](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L168)

Adds a new relation (link) from the thing to the given uri using the property

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

Defined in: [src/index.ts:233](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L233)

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

### attachments()

> **attachments**(): [`AttachmentGateway`](AttachmentGateway.md)

Defined in: [src/index.ts:267](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L267)

Provides access to attachment operations such as uploading and linking attachments to things

#### Returns

[`AttachmentGateway`](AttachmentGateway.md)

An instance of AttachmentGateway that handles attachment operations

#### Since

0.24.0

***

### buildSearchIndex()

> **buildSearchIndex**(): `Promise`\<[`SearchIndex`](SearchIndex.md)\>

Defined in: [src/index.ts:207](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L207)

Build the search index on demand.

While logged in, the index is built from the logged-in user's label indexes
and cached, so repeated calls return the same instance.

While logged out, a fresh empty index is returned that is not cached.

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [src/index.ts:243](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L243)

Creates a new label index document at a default location and links it to the user's profile or preferences document

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

The profile for that to create the index

#### Returns

`Promise`\<[`LabelIndex`](LabelIndex.md)\>

the newly created label index

***

### editPropertyValue()

> **editPropertyValue**(`thing`, `property`, `oldValue`, `newValue`): `Promise`\<`void`\>

Defined in: [src/index.ts:153](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L153)

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

### fetch()

> **fetch**(`uri`): `Promise`\<`void`\>

Defined in: [src/index.ts:107](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L107)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`void`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`void`\>[]\>

Defined in: [src/index.ts:111](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L111)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`void`\>[]\>

***

### ~~fetchFile()~~

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [src/index.ts:120](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L120)

#### Parameters

##### url

`string`

URL identifying the file

#### Returns

`Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

An object representing the fetched file

#### Deprecated

Use [FileFetcher.fetchFile](FileFetcher.md#fetchfile) via [PodOS.files](#files) instead

***

### fetchProfile()

> **fetchProfile**(`webId`): `Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

Defined in: [src/index.ts:195](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L195)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### files()

> **files**(): [`FileFetcher`](FileFetcher.md)

Defined in: [src/index.ts:128](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L128)

Provides access to file operations such as fetching and updating files in the pod

#### Returns

[`FileFetcher`](FileFetcher.md)

An instance of FileFetcher that handles file operations

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [src/index.ts:172](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L172)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadModule()

> **loadModule**\<`T`\>(`moduleName`): `Promise`\<`T`\>

Defined in: [src/index.ts:224](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L224)

Dynamically loads a module by its name and returns an instance of the module

#### Type Parameters

##### T

`T`

#### Parameters

##### moduleName

`string`

#### Returns

`Promise`\<`T`\>

***

### login()

> **login**(`oidcIssuer?`): `Promise`\<`void`\>

Defined in: [src/index.ts:216](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L216)

#### Parameters

##### oidcIssuer?

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [src/index.ts:211](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L211)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [src/index.ts:187](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L187)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeAppsFor()

> **proposeAppsFor**(`thing`): [`OpenWithApp`](../interfaces/OpenWithApp.md)[]

Defined in: [src/index.ts:276](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L276)

Propose matching apps to open a thing

#### Parameters

##### thing

[`Thing`](Thing.md)

The thing to open

#### Returns

[`OpenWithApp`](../interfaces/OpenWithApp.md)[]

An array of apps that can open the thing. The array is empty if no apps are found.

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [src/index.ts:180](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L180)

#### Parameters

##### referenceUri

`string`

##### name

`string`

#### Returns

`string`

***

### uploadAndAddPicture()

> **uploadAndAddPicture**(`thing`, `pictureFile`): `ResultAsync`\<\{ `url`: `string`; \}, [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Defined in: [src/index.ts:255](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L255)

Uploads a picture file and associates it with a thing.
The container is automatically derived from the thing's URI.

#### Parameters

##### thing

[`Thing`](Thing.md)

The thing to add the picture to

##### pictureFile

`File`

The picture file to upload

#### Returns

`ResultAsync`\<\{ `url`: `string`; \}, [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Result with the picture URL or error
