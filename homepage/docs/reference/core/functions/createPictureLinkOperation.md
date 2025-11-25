[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / createPictureLinkOperation

# Function: createPictureLinkOperation()

> **createPictureLinkOperation**(`thing`, `file`): `UpdateOperation`

Defined in: [picture/createPictureLinkOperation.ts:16](https://github.com/pod-os/PodOS/blob/4c4065daede8a874e199beaf6d6ff670f4934259/core/src/picture/createPictureLinkOperation.ts#L16)

Creates an update operation to link a picture file to a thing.
Uses schema:image as the predicate to establish the relationship.

## Parameters

### thing

[`Thing`](../classes/Thing.md)

The thing to link the picture to

### file

[`NewFile`](../interfaces/NewFile.md)

The uploaded picture file metadata

## Returns

`UpdateOperation`

UpdateOperation that adds the picture link to the thing's document
