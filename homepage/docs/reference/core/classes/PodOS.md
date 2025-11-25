[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:45](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L45)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters`): `PodOS`

Defined in: [index.ts:54](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L54)

#### Parameters

##### \_\_namedParameters

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [index.ts:47](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L47)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [index.ts:48](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L48)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:130](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L130)

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

Defined in: [index.ts:118](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L118)

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

Defined in: [index.ts:185](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L185)

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

Defined in: [index.ts:163](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L163)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:195](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L195)

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

Defined in: [index.ts:93](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L93)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:97](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L97)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### ~~fetchFile()~~

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:106](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L106)

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

Defined in: [index.ts:149](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L149)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### files()

> **files**(): [`FileFetcher`](FileFetcher.md)

Defined in: [index.ts:114](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L114)

Provides access to file operations such as fetching and updating files in the pod

#### Returns

[`FileFetcher`](FileFetcher.md)

An instance of FileFetcher that handles file operations

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:126](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L126)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadContactsModule()

> **loadContactsModule**(): `Promise`\<`ContactsModule`\>

Defined in: [index.ts:176](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L176)

#### Returns

`Promise`\<`ContactsModule`\>

***

### login()

> **login**(`oidcIssuer`): `Promise`\<`void`\>

Defined in: [index.ts:172](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L172)

#### Parameters

##### oidcIssuer

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:167](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L167)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:141](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L141)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [index.ts:134](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L134)

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

Defined in: [index.ts:207](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/index.ts#L207)

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
