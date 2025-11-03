[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / FileFetcher

# Class: FileFetcher

Defined in: [files/FileFetcher.ts:17](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/files/FileFetcher.ts#L17)

## Constructors

### Constructor

> **new FileFetcher**(`session`): `FileFetcher`

Defined in: [files/FileFetcher.ts:18](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/files/FileFetcher.ts#L18)

#### Parameters

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

#### Returns

`FileFetcher`

## Methods

### createNewFile()

> **createNewFile**(`container`, `name`): `ResultAsync`\<`NewFile`, `NotCreated`\>

Defined in: [files/FileFetcher.ts:54](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/files/FileFetcher.ts#L54)

#### Parameters

##### container

[`LdpContainer`](LdpContainer.md)

##### name

`string`

#### Returns

`ResultAsync`\<`NewFile`, `NotCreated`\>

***

### createNewFolder()

> **createNewFolder**(`container`, `name`): `ResultAsync`\<`NewFolder`, `NotCreated`\>

Defined in: [files/FileFetcher.ts:81](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/files/FileFetcher.ts#L81)

#### Parameters

##### container

[`LdpContainer`](LdpContainer.md)

##### name

`string`

#### Returns

`ResultAsync`\<`NewFolder`, `NotCreated`\>

***

### fetchFile()

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [files/FileFetcher.ts:25](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/files/FileFetcher.ts#L25)

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

Defined in: [files/FileFetcher.ts:44](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/files/FileFetcher.ts#L44)

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
