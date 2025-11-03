[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:41](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L41)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters`): `PodOS`

Defined in: [index.ts:49](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L49)

#### Parameters

##### \_\_namedParameters

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [index.ts:43](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L43)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [index.ts:44](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L44)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:124](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L124)

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

Defined in: [index.ts:112](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L112)

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

Defined in: [index.ts:179](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L179)

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

Defined in: [index.ts:157](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L157)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:189](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L189)

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

Defined in: [index.ts:87](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L87)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:91](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L91)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### ~~fetchFile()~~

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:100](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L100)

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

Defined in: [index.ts:143](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L143)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### files()

> **files**(): [`FileFetcher`](FileFetcher.md)

Defined in: [index.ts:108](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L108)

Provides access to file operations such as fetching and updating files in the pod

#### Returns

[`FileFetcher`](FileFetcher.md)

An instance of FileFetcher that handles file operations

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:120](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L120)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadContactsModule()

> **loadContactsModule**(): `Promise`\<`ContactsModule`\>

Defined in: [index.ts:170](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L170)

#### Returns

`Promise`\<`ContactsModule`\>

***

### login()

> **login**(`oidcIssuer`): `Promise`\<`void`\>

Defined in: [index.ts:166](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L166)

#### Parameters

##### oidcIssuer

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:161](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L161)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:135](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L135)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [index.ts:128](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/index.ts#L128)

#### Parameters

##### referenceUri

`string`

##### name

`string`

#### Returns

`string`
