[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Thing

# Class: Thing

Defined in: [thing/Thing.ts:41](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L41)

## Extended by

- [`RdfDocument`](RdfDocument.md)
- [`LdpContainer`](LdpContainer.md)
- [`WebIdProfile`](WebIdProfile.md)
- [`TypeIndex`](TypeIndex.md)

## Constructors

### Constructor

> **new Thing**(`uri`, `store`, `editable?`): `Thing`

Defined in: [thing/Thing.ts:42](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L42)

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

Defined in: [thing/Thing.ts:48](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L48)

Whether the Thing can be edited according to its access control settings

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [thing/Thing.ts:44](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L44)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:43](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L43)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:183](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L183)

Returns any value linked from this thing via one of the given predicates

#### Parameters

##### predicateUris

...`string`[]

#### Returns

`undefined`

***

### assume()

> **assume**\<`T`\>(`SpecificThing`): `T`

Defined in: [thing/Thing.ts:319](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L319)

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

Defined in: [thing/Thing.ts:300](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L300)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

***

### container()

> **container**(): `object`

Defined in: [thing/Thing.ts:329](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L329)

Returns the container that contains this thing's document
The container URI is derived from the thing's URI.

#### Returns

`object`

##### uri

> **uri**: `string`

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:196](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L196)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:57](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L57)

Returns a human-readable label for this thing. Tries to match common RDF terms
used for labels, such as `rdfs:label`, `schema:name` and others.

If no such term is present, it will derive a label from the URI.

#### Returns

`string`

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:80](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L80)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

***

### observeRelations()

> **observeRelations**(`predicate?`): `Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

Defined in: [thing/Thing.ts:117](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L117)

Observe changes in links from this thing to other resources

#### Parameters

##### predicate?

`string`

#### Returns

`Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

***

### observeReverseRelations()

> **observeReverseRelations**(`predicate?`): `Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

Defined in: [thing/Thing.ts:159](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L159)

Observe changes in links from other resources to this thing

#### Parameters

##### predicate?

`string`

#### Returns

`Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

***

### observeTypes()

> **observeTypes**(): `Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

Defined in: [thing/Thing.ts:281](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L281)

Observe changes to the list of RDF types for this thing

#### Returns

`Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

***

### picture()

> **picture**(): \{ `url`: `string`; \} \| `null`

Defined in: [thing/Thing.ts:217](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L217)

Returns the url of a picture or logo associated with this thing
Tries to match common RDF terms used for pictures like `schema:image`,
`vcard:photo` or `foaf:img`

#### Returns

\{ `url`: `string`; \} \| `null`

An object containing the `url` of the picture

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:97](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L97)

Returns all the unique links from this thing to other resources. This only includes named nodes and excludes rdf:type relations.

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

***

### reverseRelations()

> **reverseRelations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:140](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L140)

Returns all the unique links from other resources to this thing

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:270](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L270)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]
