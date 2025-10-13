[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PodOS

# Class: PodOS

Defined in: [index.ts:40](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L40)

## Constructors

### Constructor

> **new PodOS**(`__namedParameters`): `PodOS`

Defined in: [index.ts:48](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L48)

#### Parameters

##### \_\_namedParameters

[`PodOsConfiguration`](../interfaces/PodOsConfiguration.md) = `{}`

#### Returns

`PodOS`

## Properties

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [index.ts:42](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L42)

***

### uriService

> `readonly` **uriService**: [`UriService`](UriService.md)

Defined in: [index.ts:43](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L43)

## Methods

### addNewThing()

> **addNewThing**(`uri`, `name`, `type`): `Promise`\<`void`\>

Defined in: [index.ts:123](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L123)

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

Defined in: [index.ts:111](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L111)

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

Defined in: [index.ts:178](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L178)

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

Defined in: [index.ts:156](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L156)

Fetch the private label index for the given profile and build a search index from it

#### Parameters

##### profile

[`WebIdProfile`](WebIdProfile.md)

#### Returns

`Promise`\<[`SearchIndex`](SearchIndex.md)\>

***

### createDefaultLabelIndex()

> **createDefaultLabelIndex**(`profile`): `Promise`\<[`LabelIndex`](LabelIndex.md)\>

Defined in: [index.ts:188](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L188)

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

Defined in: [index.ts:86](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L86)

#### Parameters

##### uri

`string`

#### Returns

`Promise`\<`Response`\>

***

### fetchAll()

> **fetchAll**(`uris`): `Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

Defined in: [index.ts:90](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L90)

#### Parameters

##### uris

`string`[]

#### Returns

`Promise`\<`PromiseSettledResult`\<`Response`\>[]\>

***

### ~~fetchFile()~~

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [index.ts:99](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L99)

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

Defined in: [index.ts:142](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L142)

Fetch the WebId profile and preferences file for the given WebID

#### Parameters

##### webId

`string`

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

***

### files()

> **files**(): [`FileFetcher`](FileFetcher.md)

Defined in: [index.ts:107](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L107)

Provides access to file operations such as fetching and updating files in the pod

#### Returns

[`FileFetcher`](FileFetcher.md)

An instance of FileFetcher that handles file operations

***

### listKnownTerms()

> **listKnownTerms**(): [`Term`](../interfaces/Term.md)[]

Defined in: [index.ts:119](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L119)

#### Returns

[`Term`](../interfaces/Term.md)[]

***

### loadContactsModule()

> **loadContactsModule**(): `Promise`\<`ContactsModule`\>

Defined in: [index.ts:169](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L169)

#### Returns

`Promise`\<`ContactsModule`\>

***

### login()

> **login**(`oidcIssuer`): `Promise`\<`void`\>

Defined in: [index.ts:165](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L165)

#### Parameters

##### oidcIssuer

`string` = `"http://localhost:3000"`

#### Returns

`Promise`\<`void`\>

***

### logout()

> **logout**(): `Promise`\<`void`\>

Defined in: [index.ts:160](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L160)

#### Returns

`Promise`\<`void`\>

***

### observeSession()

> **observeSession**(): `BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

Defined in: [index.ts:134](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L134)

returns a behavior subject that can be used to observe changes in the session state

#### Returns

`BehaviorSubject`\<[`SessionInfo`](../type-aliases/SessionInfo.md)\>

***

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [index.ts:127](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/index.ts#L127)

#### Parameters

##### referenceUri

`string`

##### name

`string`

#### Returns

`string`
