[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / FileFetcher

# Class: FileFetcher

Defined in: [files/FileFetcher.ts:7](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/files/FileFetcher.ts#L7)

## Constructors

### Constructor

> **new FileFetcher**(`session`): `FileFetcher`

Defined in: [files/FileFetcher.ts:8](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/files/FileFetcher.ts#L8)

#### Parameters

##### session

[`PodOsSession`](../interfaces/PodOsSession.md)

#### Returns

`FileFetcher`

## Methods

### fetchFile()

> **fetchFile**(`url`): `Promise`\<[`SolidFile`](../interfaces/SolidFile.md)\>

Defined in: [files/FileFetcher.ts:15](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/files/FileFetcher.ts#L15)

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

Defined in: [files/FileFetcher.ts:34](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/files/FileFetcher.ts#L34)

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
