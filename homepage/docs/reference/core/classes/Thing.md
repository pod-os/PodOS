[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Thing

# Class: Thing

Defined in: [thing/Thing.ts:32](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L32)

## Extended by

- [`RdfDocument`](RdfDocument.md)
- [`LdpContainer`](LdpContainer.md)
- [`WebIdProfile`](WebIdProfile.md)
- [`TypeIndex`](TypeIndex.md)

## Constructors

### Constructor

> **new Thing**(`uri`, `store`, `editable?`): `Thing`

Defined in: [thing/Thing.ts:33](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L33)

#### Parameters

##### uri

`string`

##### store

[`Store`](Store.md)

##### editable?

`boolean` = `false`

Whether the Thing can be edited according to its access control settings

#### Returns

`Thing`

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [thing/Thing.ts:39](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L39)

Whether the Thing can be edited according to its access control settings

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [thing/Thing.ts:35](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L35)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:34](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L34)

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

***

### attachments()

> **attachments**(): [`Attachment`](../interfaces/Attachment.md)[]

Defined in: [thing/Thing.ts:226](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L226)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

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

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:141](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L141)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:48](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L48)

Returns a human-readable label for this thing. Tries to match common RDF terms
used for labels, such as `rdfs:label`, `schema:name` and others.

If no such term is present, it will derive a label from the URI.

#### Returns

`string`

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:71](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L71)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

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

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:215](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L215)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]
