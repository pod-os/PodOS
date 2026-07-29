[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / LabelIndex

# Class: LabelIndex

Defined in: [src/search/LabelIndex.ts:10](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L10)

Represents a label index document as described in
https://github.com/pod-os/PodOS/blob/main/docs/features/full-text-search.md

## Extends

- [`RdfDocument`](RdfDocument.md)

## Constructors

### Constructor

> **new LabelIndex**(`uri`, `store`, `editable?`): `LabelIndex`

Defined in: [src/search/LabelIndex.ts:11](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L11)

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

> `readonly` **editable**: `boolean`

Defined in: [src/thing/Thing.ts:82](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L82)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`editable`](RdfDocument.md#editable)

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [src/thing/Thing.ts:78](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L78)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`store`](RdfDocument.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [src/thing/Thing.ts:77](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L77)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`uri`](RdfDocument.md#uri)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [src/thing/Thing.ts:283](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L283)

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

Defined in: [src/thing/Thing.ts:470](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L470)

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

Defined in: [src/thing/Thing.ts:451](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L451)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`attachments`](RdfDocument.md#attachments)

***

### container()

> **container**(): `object`

Defined in: [src/thing/Thing.ts:480](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L480)

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

Defined in: [src/search/LabelIndex.ts:34](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L34)

#### Parameters

##### uri

`string`

#### Returns

`boolean`

***

### description()

> **description**(): `undefined`

Defined in: [src/thing/Thing.ts:350](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L350)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`description`](RdfDocument.md#description)

***

### getIndexedItems()

> **getIndexedItems**(): `object`[]

Defined in: [src/search/LabelIndex.ts:18](https://github.com/pod-os/PodOS/blob/main/core/src/search/LabelIndex.ts#L18)

Returns the URIs and labels for all the things listed in the document.

#### Returns

`object`[]

***

### label()

> **label**(): `string`

Defined in: [src/thing/Thing.ts:96](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L96)

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

Defined in: [src/thing/Thing.ts:116](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L116)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`literals`](RdfDocument.md#literals)

***

### observeAnyValue()

> **observeAnyValue**(...`predicateUris`): `Observable`\<`string` \| `undefined`\>

Defined in: [src/thing/Thing.ts:299](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L299)

Observe changes in a value linked from this thing via one of the given predicates

Note that return value may differ from that from `anyValue` when more than one value is present.

#### Parameters

##### predicateUris

...`string`[]

#### Returns

`Observable`\<`string` \| `undefined`\>

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`observeAnyValue`](RdfDocument.md#observeanyvalue)

***

### observeDescription()

> **observeDescription**(): `Observable`\<`string` \| `undefined`\>

Defined in: [src/thing/Thing.ts:357](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L357)

Observe changes in literal values that describe this thing. See `description`

#### Returns

`Observable`\<`string` \| `undefined`\>

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`observeDescription`](RdfDocument.md#observedescription)

***

### observeLabel()

> **observeLabel**(): `Observable`\<`string`\>

Defined in: [src/thing/Thing.ts:107](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L107)

Observe changes in human-readable label for this thing. See `label`.

#### Returns

`Observable`\<`string`\>

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`observeLabel`](RdfDocument.md#observelabel)

***

### observeLiterals()

> **observeLiterals**(): `Observable`\<[`Literal`](../interfaces/Literal.md)[]\>

Defined in: [src/thing/Thing.ts:133](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L133)

Observe changes in literal values linked to this thing

#### Returns

`Observable`\<[`Literal`](../interfaces/Literal.md)[]\>

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`observeLiterals`](RdfDocument.md#observeliterals)

***

### observeRelations()

> **observeRelations**(`predicate?`): `Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

Defined in: [src/thing/Thing.ts:170](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L170)

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

Defined in: [src/thing/Thing.ts:266](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L266)

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

Defined in: [src/thing/Thing.ts:432](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L432)

Observe changes to the list of RDF types for this thing

#### Returns

`Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`observeTypes`](RdfDocument.md#observetypes)

***

### picture()

> **picture**(): \{ `url`: `string`; \} \| `null`

Defined in: [src/thing/Thing.ts:368](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L368)

Returns the url of a picture or logo associated with this thing
Tries to match common RDF terms used for pictures like `schema:image`,
`vcard:photo` or `foaf:img`

#### Returns

\{ `url`: `string`; \} \| `null`

An object containing the `url` of the picture

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`picture`](RdfDocument.md#picture)

***

### rdfDocument()

> **rdfDocument**(): `string` \| `undefined`

Defined in: [src/thing/Thing.ts:489](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L489)

#### Returns

`string` \| `undefined`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`rdfDocument`](RdfDocument.md#rdfdocument)

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [src/thing/Thing.ts:150](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L150)

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

Defined in: [src/thing/Thing.ts:247](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L247)

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

Defined in: [src/rdf-document/RdfDocument.ts:14](https://github.com/pod-os/PodOS/blob/main/core/src/rdf-document/RdfDocument.ts#L14)

#### Returns

`object`[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`subjects`](RdfDocument.md#subjects)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [src/thing/Thing.ts:421](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L421)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`types`](RdfDocument.md#types)
