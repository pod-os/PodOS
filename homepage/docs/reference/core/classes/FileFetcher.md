[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / FileFetcher

# Class: FileFetcher

Defined in: [files/FileFetcher.ts:20](https://github.com/pod-os/PodOS/blob/main/core/src/files/FileFetcher.ts#L20)

Handles HTTP operations for files, like fetching and updating file contents.

## Constructors

### Constructor

> **new FileFetcher**(`session`): `FileFetcher`

Defined in: [files/FileFetcher.ts:23](https://github.com/pod-os/PodOS/blob/main/core/src/files/FileFetcher.ts#L23)

#### Parameters

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

#### Returns

`FileFetcher`

## Methods

### createNewFile()

> **createNewFile**(`container`, `name`): `ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), `NotCreated`\>

Defined in: [files/FileFetcher.ts:61](https://github.com/pod-os/PodOS/blob/main/core/src/files/FileFetcher.ts#L61)

#### Parameters

##### container

[`LdpContainer`](LdpContainer.md)

##### name

`string` \| `File`

#### Returns

`ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), `NotCreated`\>

***

### createNewFolder()

> **createNewFolder**(`container`, `name`): `ResultAsync`\<[`NewFolder`](../interfaces/NewFolder.md), `NotCreated`\>

Defined in: [files/FileFetcher.ts:95](https://github.com/pod-os/PodOS/blob/main/core/src/files/FileFetcher.ts#L95)

#### Parameters

##### container

[`LdpContainer`](LdpContainer.md)

##### name

`string`

#### Returns

`ResultAsync`\<[`NewFolder`](../interfaces/NewFolder.md), `NotCreated`\>

***

### fetchFile()

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [files/FileFetcher.ts:32](https://github.com/pod-os/PodOS/blob/main/core/src/files/FileFetcher.ts#L32)

Fetch the contents of the given file

#### Parameters

##### url

`string`

URL identifying the file

#### Returns

`Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

An object representing the fetched file

***

### putFile()

> **putFile**(`file`, `newContent`): `Promise`\<`Response`\>

Defined in: [files/FileFetcher.ts:51](https://github.com/pod-os/PodOS/blob/main/core/src/files/FileFetcher.ts#L51)

Updates the contents of a file (overrides old content with the given one)

#### Parameters

##### file

[`SolidFile`](../interfaces/SolidFile.md)

The file to update

##### newContent

`string`

The content to put into the file, overriding all existing

#### Returns

`Promise`\<`Response`\>

The HTTP response
