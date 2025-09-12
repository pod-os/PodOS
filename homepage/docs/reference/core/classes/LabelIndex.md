[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / LabelIndex

# Class: LabelIndex

Defined in: [search/LabelIndex.ts:9](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L9)

Represents a label index document as described in
https://github.com/pod-os/PodOS/blob/main/docs/features/full-text-search.md

## Extends

- [`RdfDocument`](RdfDocument.md)

## Constructors

### Constructor

> **new LabelIndex**(`uri`, `store`, `editable`): `LabelIndex`

Defined in: [search/LabelIndex.ts:10](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L10)

#### Parameters

##### uri

`string`

##### store

`IndexedFormula`

##### editable

`boolean` = `false`

#### Returns

`LabelIndex`

#### Overrides

[`RdfDocument`](RdfDocument.md).[`constructor`](RdfDocument.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [search/LabelIndex.ts:13](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L13)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`editable`](RdfDocument.md#editable)

***

### store

> `readonly` **store**: `IndexedFormula`

Defined in: [search/LabelIndex.ts:12](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L12)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`store`](RdfDocument.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [search/LabelIndex.ts:11](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L11)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`uri`](RdfDocument.md#uri)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:108](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L108)

#### Parameters

##### predicateUris

...`string`[]

#### Returns

`undefined`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`anyValue`](RdfDocument.md#anyvalue)

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

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`assume`](RdfDocument.md#assume)

***

### contains()

> **contains**(`uri`): `boolean`

Defined in: [search/LabelIndex.ts:37](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L37)

#### Parameters

##### uri

`string`

#### Returns

`boolean`

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:117](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L117)

#### Returns

`undefined`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`description`](RdfDocument.md#description)

***

### getIndexedItems()

> **getIndexedItems**(): `object`[]

Defined in: [search/LabelIndex.ts:21](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/search/LabelIndex.ts#L21)

Returns the URIs and labels for all the things listed in the document.

#### Returns

`object`[]

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:41](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L41)

#### Returns

`string`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`label`](RdfDocument.md#label)

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:61](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L61)

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`literals`](RdfDocument.md#literals)

***

### picture()

> **picture**(): `null` \| \{ `url`: `string`; \}

Defined in: [thing/Thing.ts:131](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L131)

#### Returns

`null` \| \{ `url`: `string`; \}

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`picture`](RdfDocument.md#picture)

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:75](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L75)

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`relations`](RdfDocument.md#relations)

***

### reverseRelations()

> **reverseRelations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:92](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L92)

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`reverseRelations`](RdfDocument.md#reverserelations)

***

### subjects()

> **subjects**(): `object`[]

Defined in: [rdf-document/RdfDocument.ts:17](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/rdf-document/RdfDocument.ts#L17)

#### Returns

`object`[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`subjects`](RdfDocument.md#subjects)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:181](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L181)

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`types`](RdfDocument.md#types)
