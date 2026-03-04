[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / WebIdProfile

# Class: WebIdProfile

Defined in: [profile/WebIdProfile.ts:9](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L9)

Allows finding things related to the WebID and their profile document

## Extends

- [`Thing`](Thing.md)

## Constructors

### Constructor

> **new WebIdProfile**(`webId`, `store`, `editable?`): `WebIdProfile`

Defined in: [profile/WebIdProfile.ts:11](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L11)

#### Parameters

##### webId

`string`

##### store

[`Store`](Store.md)

##### editable?

`boolean` = `false`

#### Returns

`WebIdProfile`

#### Overrides

[`Thing`](Thing.md).[`constructor`](Thing.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [profile/WebIdProfile.ts:14](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L14)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [profile/WebIdProfile.ts:13](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L13)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:34](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L34)

#### Inherited from

[`Thing`](Thing.md).[`uri`](Thing.md#uri)

***

### webId

> `readonly` **webId**: `string`

Defined in: [profile/WebIdProfile.ts:12](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L12)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:128](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L128)

Returns any value linked from this thing via one of the given predicates

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

Defined in: [thing/Thing.ts:245](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L245)

Call this method to switch to a more specific subclass of Thing.

#### Type Parameters

##### T

`T`

#### Parameters

##### SpecificThing

(`uri`, `store`, `editable`) => `T`

a subclass of Thing to assume

#### Returns

`T`

#### Inherited from

[`Thing`](Thing.md).[`assume`](Thing.md#assume)

***

### attachments()

> **attachments**(): [`Attachment`](../interfaces/Attachment.md)[]

Defined in: [thing/Thing.ts:226](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L226)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

#### Inherited from

[`Thing`](Thing.md).[`attachments`](Thing.md#attachments)

***

### container()

> **container**(): `object`

Defined in: [thing/Thing.ts:255](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L255)

Returns the container that contains this thing's document
The container URI is derived from the thing's URI.

#### Returns

`object`

##### uri

> **uri**: `string`

#### Inherited from

[`Thing`](Thing.md).[`container`](Thing.md#container)

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:141](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L141)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`Thing`](Thing.md).[`description`](Thing.md#description)

***

### getPreferencesFile()

> **getPreferencesFile**(): `string` \| `undefined`

Defined in: [profile/WebIdProfile.ts:23](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L23)

Returns the URI of the preferences document

#### Returns

`string` \| `undefined`

***

### getPrivateLabelIndexes()

> **getPrivateLabelIndexes**(): `string`[]

Defined in: [profile/WebIdProfile.ts:49](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L49)

Returns the URIs of the private label indexes

#### Returns

`string`[]

***

### getPrivateTypeIndex()

> **getPrivateTypeIndex**(): `string` \| `undefined`

Defined in: [profile/WebIdProfile.ts:39](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L39)

Returns the URI of the private type index document

#### Returns

`string` \| `undefined`

#### Since

0.24.0

***

### getPublicTypeIndex()

> **getPublicTypeIndex**(): `string` \| `undefined`

Defined in: [profile/WebIdProfile.ts:31](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L31)

Returns the URI of the public type index document

#### Returns

`string` \| `undefined`

#### Since

0.24.0

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:48](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L48)

Returns a human-readable label for this thing. Tries to match common RDF terms
used for labels, such as `rdfs:label`, `schema:name` and others.

If no such term is present, it will derive a label from the URI.

#### Returns

`string`

#### Inherited from

[`Thing`](Thing.md).[`label`](Thing.md#label)

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:71](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L71)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`Thing`](Thing.md).[`literals`](Thing.md#literals)

***

### picture()

> **picture**(): \{ `url`: `string`; \} \| `null`

Defined in: [thing/Thing.ts:162](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L162)

Returns the url of a picture or logo associated with this thing
Tries to match common RDF terms used for pictures like `schema:image`,
`vcard:photo` or `foaf:img`

#### Returns

\{ `url`: `string`; \} \| `null`

An object containing the `url` of the picture

#### Inherited from

[`Thing`](Thing.md).[`picture`](Thing.md#picture)

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:88](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L88)

Returns all the links from this thing to other resources

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

Defined in: [thing/Thing.ts:108](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L108)

Returns all the links from other resources to this thing

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

Defined in: [thing/Thing.ts:215](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L215)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
