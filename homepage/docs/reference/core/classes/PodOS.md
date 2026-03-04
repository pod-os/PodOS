[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:48](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L48)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters?`): `PodOS`

Defined in: [index.ts:60](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L60)

#### Parameters

##### \_\_namedParameters?

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [index.ts:50](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L50)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [index.ts:51](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L51)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:139](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L139)

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

Defined in: [index.ts:127](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L127)

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

Defined in: [index.ts:192](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L192)

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

Defined in: [index.ts:226](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L226)

Provides access to attachment operations such as uploading and linking attachments to things

#### Returns

[`AttachmentGateway`](AttachmentGateway.md)

An instance of AttachmentGateway that handles attachment operations

#### Since

0.24.0

***

### buildSearchIndex()

> **buildSearchIndex**(`profile`): `Promise`\<[`SearchIndex`](SearchIndex.md)\>

Defined in: [index.ts:166](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L166)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:202](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L202)

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

Defined in: [index.ts:102](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L102)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:106](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L106)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### ~~fetchFile()~~

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:115](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L115)

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

Defined in: [index.ts:158](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L158)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### files()

> **files**(): [`FileFetcher`](FileFetcher.md)

Defined in: [index.ts:123](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L123)

Provides access to file operations such as fetching and updating files in the pod

#### Returns

[`FileFetcher`](FileFetcher.md)

An instance of FileFetcher that handles file operations

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:135](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L135)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadModule()

> **loadModule**\<`T`\>(`moduleName`): `Promise`\<`T`\>

Defined in: [index.ts:183](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L183)

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

Defined in: [index.ts:175](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L175)

#### Parameters

##### oidcIssuer?

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:170](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L170)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:150](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L150)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeAppsFor()

> **proposeAppsFor**(`thing`): [`OpenWithApp`](../interfaces/OpenWithApp.md)[]

Defined in: [index.ts:235](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L235)

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

Defined in: [index.ts:143](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L143)

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

Defined in: [index.ts:214](https://github.com/pod-os/PodOS/blob/main/core/src/index.ts#L214)

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
