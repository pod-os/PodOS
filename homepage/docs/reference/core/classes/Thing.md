[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Thing

# Class: Thing

Defined in: [thing/Thing.ts:31](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L31)

## Extended by

- [`RdfDocument`](RdfDocument.md)
- [`LdpContainer`](LdpContainer.md)
- [`WebIdProfile`](WebIdProfile.md)

## Constructors

### Constructor

> **new Thing**(`uri`, `store`, `editable`): `Thing`

Defined in: [thing/Thing.ts:32](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L32)

#### Parameters

##### uri

`string`

##### store

`IndexedFormula`

##### editable

`boolean` = `false`

Whether the Thing can be edited according to its access control settings

#### Returns

`Thing`

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [thing/Thing.ts:38](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L38)

Whether the Thing can be edited according to its access control settings

***

### store

> `readonly` **store**: `IndexedFormula`

Defined in: [thing/Thing.ts:34](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L34)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:33](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L33)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:108](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L108)

#### Parameters

##### predicateUris

...`string`[]

#### Returns

`undefined`

***

### assume()

> **assume**\<`T`\>(`SpecificThing`): `T`

Defined in: [thing/Thing.ts:189](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L189)

#### Type Parameters

##### T

`T`

#### Parameters

##### SpecificThing

(`uri`, `store`, `editable`) => `T`

#### Returns

`T`

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:117](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L117)

#### Returns

`undefined`

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:41](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L41)

#### Returns

`string`

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:61](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L61)

#### Returns

[`Literal`](../interfaces/Literal.md)[]

***

### picture()

> **picture**(): `null` \| \{ `url`: `string`; \}

Defined in: [thing/Thing.ts:131](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L131)

#### Returns

`null` \| \{ `url`: `string`; \}

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:75](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L75)

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

***

### reverseRelations()

> **reverseRelations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:92](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L92)

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:181](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L181)

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]
