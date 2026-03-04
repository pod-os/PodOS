[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / LabelIndex

# Class: LabelIndex

Defined in: [search/LabelIndex.ts:10](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L10)

Represents a label index document as described in
https://github.com/pod-os/PodOS/blob/main/docs/features/full-text-search.md

## Extends

- [`RdfDocument`](RdfDocument.md)

## Constructors

### Constructor

> **new LabelIndex**(`uri`, `store`, `editable?`): `LabelIndex`

Defined in: [search/LabelIndex.ts:11](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L11)

#### Parameters

##### uri

`string`

##### store

[`Store`](Store.md)

##### editable?

`boolean` = `false`

#### Returns

`LabelIndex`

#### Overrides

[`RdfDocument`](RdfDocument.md).[`constructor`](RdfDocument.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [search/LabelIndex.ts:14](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L14)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`editable`](RdfDocument.md#editable)

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [search/LabelIndex.ts:13](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L13)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`store`](RdfDocument.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [search/LabelIndex.ts:12](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L12)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`uri`](RdfDocument.md#uri)

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

[`RdfDocument`](RdfDocument.md).[`anyValue`](RdfDocument.md#anyvalue)

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

[`RdfDocument`](RdfDocument.md).[`assume`](RdfDocument.md#assume)

***

### attachments()

> **attachments**(): [`Attachment`](../interfaces/Attachment.md)[]

Defined in: [thing/Thing.ts:300](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L300)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`attachments`](RdfDocument.md#attachments)

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

[`RdfDocument`](RdfDocument.md).[`container`](RdfDocument.md#container)

***

### contains()

> **contains**(`uri`): `boolean`

Defined in: [search/LabelIndex.ts:38](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L38)

#### Parameters

##### uri

`string`

#### Returns

`boolean`

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:196](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L196)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`description`](RdfDocument.md#description)

***

### getIndexedItems()

> **getIndexedItems**(): `object`[]

Defined in: [search/LabelIndex.ts:22](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L22)

Returns the URIs and labels for all the things listed in the document.

#### Returns

`object`[]

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

[`RdfDocument`](RdfDocument.md).[`label`](RdfDocument.md#label)

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:80](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L80)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`literals`](RdfDocument.md#literals)

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

[`RdfDocument`](RdfDocument.md).[`observeRelations`](RdfDocument.md#observerelations)

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

[`RdfDocument`](RdfDocument.md).[`observeReverseRelations`](RdfDocument.md#observereverserelations)

***

### observeTypes()

> **observeTypes**(): `Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

Defined in: [thing/Thing.ts:281](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L281)

Observe changes to the list of RDF types for this thing

#### Returns

`Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`observeTypes`](RdfDocument.md#observetypes)

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

[`RdfDocument`](RdfDocument.md).[`picture`](RdfDocument.md#picture)

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

[`RdfDocument`](RdfDocument.md).[`relations`](RdfDocument.md#relations)

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

[`RdfDocument`](RdfDocument.md).[`reverseRelations`](RdfDocument.md#reverserelations)

***

### subjects()

> **subjects**(): `object`[]

Defined in: [rdf-document/RdfDocument.ts:18](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L18)

#### Returns

`object`[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`subjects`](RdfDocument.md#subjects)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:270](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L270)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`types`](RdfDocument.md#types)
