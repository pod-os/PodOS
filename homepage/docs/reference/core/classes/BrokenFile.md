[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / BrokenFile

# Class: BrokenFile

Defined in: [files/BrokenFile.ts:4](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/files/BrokenFile.ts#L4)

## Implements

- [`SolidFile`](../interfaces/SolidFile.md)

## Constructors

### Constructor

> **new BrokenFile**(`url`, `status`): `BrokenFile`

Defined in: [files/BrokenFile.ts:5](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/files/BrokenFile.ts#L5)

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

Defined in: [files/BrokenFile.ts:7](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/files/BrokenFile.ts#L7)

***

### url

> `readonly` **url**: `string`

Defined in: [files/BrokenFile.ts:6](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/files/BrokenFile.ts#L6)

#### Implementation of

[`SolidFile`](../interfaces/SolidFile.md).[`url`](../interfaces/SolidFile.md#url)

## Methods

### blob()

> **blob**(): `null` \| `Blob`

Defined in: [files/BrokenFile.ts:14](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/files/BrokenFile.ts#L14)

#### Returns

`null` \| `Blob`

#### Implementation of

[`SolidFile`](../interfaces/SolidFile.md).[`blob`](../interfaces/SolidFile.md#blob)

***

### toString()

> **toString**(): `string`

Defined in: [files/BrokenFile.ts:10](https://github.com/pod-os/PodOS/blob/05359ae5a5ec21be7fe13c91bc776d19e0a5d007/core/src/files/BrokenFile.ts#L10)

Returns a string representation of an object.

#### Returns

`string`
