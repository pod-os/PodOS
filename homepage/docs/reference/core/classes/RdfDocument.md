[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / RdfDocument

# Class: RdfDocument

Defined in: [rdf-document/RdfDocument.ts:9](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L9)

## Extends

- [`Thing`](Thing.md)

## Extended by

- [`LabelIndex`](LabelIndex.md)

## Constructors

### Constructor

> **new RdfDocument**(`uri`, `store`, `editable?`): `RdfDocument`

Defined in: [rdf-document/RdfDocument.ts:10](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L10)

#### Parameters

##### uri

`string`

##### store

[`Store`](Store.md)

##### editable?

`boolean` = `false`

#### Returns

`RdfDocument`

#### Overrides

[`Thing`](Thing.md).[`constructor`](Thing.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [rdf-document/RdfDocument.ts:13](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L13)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [rdf-document/RdfDocument.ts:12](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L12)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [rdf-document/RdfDocument.ts:11](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L11)

#### Inherited from

[`Thing`](Thing.md).[`uri`](Thing.md#uri)

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

#### Inherited from

[`Thing`](Thing.md).[`anyValue`](Thing.md#anyvalue)

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

#### Inherited from

[`Thing`](Thing.md).[`assume`](Thing.md#assume)

***

### attachments()

> **attachments**(): [`Attachment`](../interfaces/Attachment.md)[]

Defined in: [thing/Thing.ts:300](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L300)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

#### Inherited from

[`Thing`](Thing.md).[`attachments`](Thing.md#attachments)

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

#### Inherited from

[`Thing`](Thing.md).[`container`](Thing.md#container)

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:196](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L196)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`Thing`](Thing.md).[`description`](Thing.md#description)

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:57](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L57)

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

Defined in: [thing/Thing.ts:80](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L80)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`Thing`](Thing.md).[`literals`](Thing.md#literals)

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

#### Inherited from

[`Thing`](Thing.md).[`observeRelations`](Thing.md#observerelations)

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

#### Inherited from

[`Thing`](Thing.md).[`observeReverseRelations`](Thing.md#observereverserelations)

***

### observeTypes()

> **observeTypes**(): `Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

Defined in: [thing/Thing.ts:281](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L281)

Observe changes to the list of RDF types for this thing

#### Returns

`Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

#### Inherited from

[`Thing`](Thing.md).[`observeTypes`](Thing.md#observetypes)

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

#### Inherited from

[`Thing`](Thing.md).[`picture`](Thing.md#picture)

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

#### Inherited from

[`Thing`](Thing.md).[`relations`](Thing.md#relations)

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

#### Inherited from

[`Thing`](Thing.md).[`reverseRelations`](Thing.md#reverserelations)

***

### subjects()

> **subjects**(): `object`[]

Defined in: [rdf-document/RdfDocument.ts:18](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L18)

#### Returns

`object`[]

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:270](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L270)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
