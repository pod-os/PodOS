[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PictureGateway

# Class: PictureGateway

Defined in: [picture/PictureGateway.ts:9](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/picture/PictureGateway.ts#L9)

Gateway for picture-related operations on Solid Pods and the store.

## Constructors

### Constructor

> **new PictureGateway**(`attachmentGateway`): `PictureGateway`

Defined in: [picture/PictureGateway.ts:10](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/picture/PictureGateway.ts#L10)

#### Parameters

##### attachmentGateway

[`FileGateway`](FileGateway.md)

#### Returns

`PictureGateway`

## Methods

### uploadAndAddPicture()

> **uploadAndAddPicture**(`thing`, `pictureFile`): `ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Defined in: [picture/PictureGateway.ts:21](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/picture/PictureGateway.ts#L21)

Uploads a picture file and associates it with a thing.
The container is automatically derived from the thing's URI.
Uses schema:image as the predicate.

#### Parameters

##### thing

[`Thing`](Thing.md)

The thing to add the picture to

##### pictureFile

`File`

The picture file to upload

#### Returns

`ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Result with the uploaded picture metadata (url, name, contentType) or error
