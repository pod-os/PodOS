[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:47](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L47)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters`): `PodOS`

Defined in: [index.ts:59](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L59)

#### Parameters

##### \_\_namedParameters

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [index.ts:49](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L49)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [index.ts:50](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L50)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:138](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L138)

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

Defined in: [index.ts:126](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L126)

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

Defined in: [index.ts:187](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L187)

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

Defined in: [index.ts:221](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L221)

Provides access to attachment operations such as uploading and linking attachments to things

#### Returns

[`AttachmentGateway`](AttachmentGateway.md)

An instance of AttachmentGateway that handles attachment operations

#### Since

0.24.0

***

### buildSearchIndex()

> **buildSearchIndex**(`profile`): `Promise`\<[`SearchIndex`](SearchIndex.md)\>

Defined in: [index.ts:165](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L165)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:197](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L197)

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

Defined in: [index.ts:101](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L101)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:105](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L105)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### ~~fetchFile()~~

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:114](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L114)

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

Defined in: [index.ts:157](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L157)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### files()

> **files**(): [`FileFetcher`](FileFetcher.md)

Defined in: [index.ts:122](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L122)

Provides access to file operations such as fetching and updating files in the pod

#### Returns

[`FileFetcher`](FileFetcher.md)

An instance of FileFetcher that handles file operations

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:134](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L134)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadContactsModule()

> **loadContactsModule**(): `Promise`\<`ContactsModule`\>

Defined in: [index.ts:178](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L178)

#### Returns

`Promise`\<`ContactsModule`\>

***

### login()

> **login**(`oidcIssuer`): `Promise`\<`void`\>

Defined in: [index.ts:174](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L174)

#### Parameters

##### oidcIssuer

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:169](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L169)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:149](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L149)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [index.ts:142](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L142)

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

Defined in: [index.ts:209](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/index.ts#L209)

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
