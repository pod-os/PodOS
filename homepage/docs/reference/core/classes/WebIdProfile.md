[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / WebIdProfile

# Class: WebIdProfile

Defined in: [profile/WebIdProfile.ts:7](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L7)

Allows to find things related to the WebID and their profile document

## Extends

- [`Thing`](Thing.md)

## Constructors

### Constructor

> **new WebIdProfile**(`webId`, `store`, `editable`): `WebIdProfile`

Defined in: [profile/WebIdProfile.ts:8](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L8)

#### Parameters

##### webId

`string`

##### store

`IndexedFormula`

##### editable

`boolean` = `false`

#### Returns

`WebIdProfile`

#### Overrides

[`Thing`](Thing.md).[`constructor`](Thing.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [profile/WebIdProfile.ts:11](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L11)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: `IndexedFormula`

Defined in: [profile/WebIdProfile.ts:10](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L10)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:33](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L33)

#### Inherited from

[`Thing`](Thing.md).[`uri`](Thing.md#uri)

***

### webId

> `readonly` **webId**: `string`

Defined in: [profile/WebIdProfile.ts:9](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L9)

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

[`Thing`](Thing.md).[`anyValue`](Thing.md#anyvalue)

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

[`Thing`](Thing.md).[`assume`](Thing.md#assume)

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:117](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L117)

#### Returns

`undefined`

#### Inherited from

[`Thing`](Thing.md).[`description`](Thing.md#description)

***

### getPreferencesFile()

> **getPreferencesFile**(): `string` \| `void`

Defined in: [profile/WebIdProfile.ts:19](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L19)

Returns te URI of the preferences document

#### Returns

`string` \| `void`

***

### getPrivateLabelIndexes()

> **getPrivateLabelIndexes**(): `string`[]

Defined in: [profile/WebIdProfile.ts:31](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/profile/WebIdProfile.ts#L31)

Returns the URIs of the private label indexes

#### Returns

`string`[]

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:41](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L41)

#### Returns

`string`

#### Inherited from

[`Thing`](Thing.md).[`label`](Thing.md#label)

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:61](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L61)

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`Thing`](Thing.md).[`literals`](Thing.md#literals)

***

### picture()

> **picture**(): `null` \| \{ `url`: `string`; \}

Defined in: [thing/Thing.ts:131](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L131)

#### Returns

`null` \| \{ `url`: `string`; \}

#### Inherited from

[`Thing`](Thing.md).[`picture`](Thing.md#picture)

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

[`Thing`](Thing.md).[`relations`](Thing.md#relations)

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

[`Thing`](Thing.md).[`reverseRelations`](Thing.md#reverserelations)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:181](https://github.com/pod-os/PodOS/blob/1aecf6de76fa668e7779c8aad7b604e498d41244/core/src/thing/Thing.ts#L181)

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
