[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / AttachmentGateway

# Class: AttachmentGateway

Defined in: [attachments/AttachmentGateway.ts:11](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/attachments/AttachmentGateway.ts#L11)

Gateway for attachment-related operations on Solid Pods and the store.

## Since

0.24.0

## Constructors

### Constructor

> **new AttachmentGateway**(`fileGateway`): `AttachmentGateway`

Defined in: [attachments/AttachmentGateway.ts:12](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/attachments/AttachmentGateway.ts#L12)

#### Parameters

##### fileGateway

[`FileGateway`](FileGateway.md)

#### Returns

`AttachmentGateway`

## Methods

### uploadAndAddAttachment()

> **uploadAndAddAttachment**(`thing`, `attachmentFile`): `ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Defined in: [attachments/AttachmentGateway.ts:23](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/attachments/AttachmentGateway.ts#L23)

Uploads an attachment file and associates it with a thing.
The container is automatically derived from the thing's URI.
Uses flow:attachment as the predicate.

#### Parameters

##### thing

[`Thing`](Thing.md)

The thing to add the attachment to

##### attachmentFile

`File`

The attachment file to upload

#### Returns

`ResultAsync`\<[`NewFile`](../interfaces/NewFile.md), [`NetworkProblem`](../interfaces/NetworkProblem.md) \| [`HttpProblem`](../interfaces/HttpProblem.md)\>

Result with the uploaded attachment metadata (url, name, contentType) or error
