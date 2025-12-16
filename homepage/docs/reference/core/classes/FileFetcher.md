[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / FileFetcher

# Class: FileFetcher

Defined in: [files/FileFetcher.ts:20](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileFetcher.ts#L20)

Handles HTTP operations for files, like fetching and updating file contents.

## Constructors

### Constructor

> **new FileFetcher**(`session`): `FileFetcher`

Defined in: [files/FileFetcher.ts:21](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileFetcher.ts#L21)

#### Parameters

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

#### Returns

`FileFetcher`

## Methods

### createNewFile()

> **createNewFile**(`container`, `name`): `ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), `NotCreated`\>

Defined in: [files/FileFetcher.ts:57](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileFetcher.ts#L57)

#### Parameters

##### container

[`LdpContainer`](LdpContainer.md)

##### name

`string` | `File`

#### Returns

`ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), `NotCreated`\>

***

### createNewFolder()

> **createNewFolder**(`container`, `name`): `ResultAsync`\<[`NewFolder`](../interfaces/NewFolder.md), `NotCreated`\>

Defined in: [files/FileFetcher.ts:91](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileFetcher.ts#L91)

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

Defined in: [files/FileFetcher.ts:28](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileFetcher.ts#L28)

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

Defined in: [files/FileFetcher.ts:47](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileFetcher.ts#L47)

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
