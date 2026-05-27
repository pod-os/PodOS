[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / BrokenFile

# Class: BrokenFile

Defined in: [files/BrokenFile.ts:4](https://github.com/pod-os/PodOS/blob/main/core/src/files/BrokenFile.ts#L4)

## Implements

- [`SolidFile`](../interfaces/SolidFile.md)

## Constructors

### Constructor

> **new BrokenFile**(`url`, `status`): `BrokenFile`

Defined in: [files/BrokenFile.ts:8](https://github.com/pod-os/PodOS/blob/main/core/src/files/BrokenFile.ts#L8)

#### Parameters

##### url

`string`

##### status

[`HttpStatus`](HttpStatus.md)

#### Returns

`BrokenFile`

## Properties

### status

> `readonly` **status**: [`HttpStatus`](HttpStatus.md)

Defined in: [files/BrokenFile.ts:6](https://github.com/pod-os/PodOS/blob/main/core/src/files/BrokenFile.ts#L6)

***

### url

> `readonly` **url**: `string`

Defined in: [files/BrokenFile.ts:5](https://github.com/pod-os/PodOS/blob/main/core/src/files/BrokenFile.ts#L5)

#### Implementation of

[`SolidFile`](../interfaces/SolidFile.md).[`url`](../interfaces/SolidFile.md#url)

## Methods

### blob()

> **blob**(): `Blob` \| `null`

Defined in: [files/BrokenFile.ts:17](https://github.com/pod-os/PodOS/blob/main/core/src/files/BrokenFile.ts#L17)

#### Returns

`Blob` \| `null`

#### Implementation of

[`SolidFile`](../interfaces/SolidFile.md).[`blob`](../interfaces/SolidFile.md#blob)

***

### toString()

> **toString**(): `string`

Defined in: [files/BrokenFile.ts:13](https://github.com/pod-os/PodOS/blob/main/core/src/files/BrokenFile.ts#L13)

Returns a string representation of an object.

#### Returns

`string`
