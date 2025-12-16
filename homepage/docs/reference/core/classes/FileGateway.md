[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / FileGateway

# Class: FileGateway

Defined in: [files/FileGateway.ts:13](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileGateway.ts#L13)

Gateway for file-related operations on Solid Pods and the store.

## Since

0.24.0

## Constructors

### Constructor

> **new FileGateway**(`store`, `fileFetcher`): `FileGateway`

Defined in: [files/FileGateway.ts:14](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileGateway.ts#L14)

#### Parameters

##### store

[`Store`](Store.md)

##### fileFetcher

[`FileFetcher`](FileFetcher.md)

#### Returns

`FileGateway`

## Methods

### uploadAndLinkFile()

> **uploadAndLinkFile**(`thing`, `predicateUri`, `fileToUpload`): `ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Defined in: [files/FileGateway.ts:29](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/files/FileGateway.ts#L29)

Uploads a file and associates it with a thing.
The container is automatically derived from the thing's URI.
Uses schema:image as the predicate.

#### Parameters

##### thing

[`Thing`](Thing.md)

The thing to add the file to

##### predicateUri

`string`

The URI of the predicate to use

##### fileToUpload

`File`

The file to upload

#### Returns

`ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Result with the uploaded metadata (url, name, contentType) or error
