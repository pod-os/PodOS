[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / PictureGateway

# Class: PictureGateway

Defined in: [picture/PictureGateway.ts:9](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/picture/PictureGateway.ts#L9)

## Constructors

### Constructor

> **new PictureGateway**(`store`, `fileFetcher`): `PictureGateway`

Defined in: [picture/PictureGateway.ts:10](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/picture/PictureGateway.ts#L10)

#### Parameters

##### store

[`Store`](Store.md)

##### fileFetcher

[`FileFetcher`](FileFetcher.md)

#### Returns

`PictureGateway`

## Methods

### uploadAndAddPicture()

> **uploadAndAddPicture**(`thing`, `pictureFile`): `ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Defined in: [picture/PictureGateway.ts:24](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/picture/PictureGateway.ts#L24)

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
