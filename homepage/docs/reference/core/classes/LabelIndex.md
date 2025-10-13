[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / LabelIndex

# Class: LabelIndex

Defined in: [search/LabelIndex.ts:9](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L9)

Represents a label index document as described in
https://github.com/pod-os/PodOS/blob/main/docs/features/full-text-search.md

## Extends

- [`RdfDocument`](RdfDocument.md)

## Constructors

### Constructor

> **new LabelIndex**(`uri`, `store`, `editable`): `LabelIndex`

Defined in: [search/LabelIndex.ts:10](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L10)

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

Defined in: [search/LabelIndex.ts:13](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L13)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`editable`](RdfDocument.md#editable)

***

### store

> `readonly` **store**: `IndexedFormula`

Defined in: [search/LabelIndex.ts:12](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L12)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`store`](RdfDocument.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [search/LabelIndex.ts:11](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L11)

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`uri`](RdfDocument.md#uri)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:127](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L127)

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

Defined in: [thing/Thing.ts:227](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L227)

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

### contains()

> **contains**(`uri`): `boolean`

Defined in: [search/LabelIndex.ts:37](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L37)

#### Parameters

##### uri

`string`

#### Returns

`boolean`

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:140](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L140)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`description`](RdfDocument.md#description)

***

### getIndexedItems()

> **getIndexedItems**(): `object`[]

Defined in: [search/LabelIndex.ts:21](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/search/LabelIndex.ts#L21)

Returns the URIs and labels for all the things listed in the document.

#### Returns

`object`[]

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:47](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L47)

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

Defined in: [thing/Thing.ts:70](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L70)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`literals`](RdfDocument.md#literals)

***

### picture()

> **picture**(): `null` \| \{ `url`: `string`; \}

Defined in: [thing/Thing.ts:161](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L161)

Returns the url of a picture or logo associated with this thing
Tries to match common RDF terms used for pictures like `schema:image`,
`vcard:photo` or `foaf:img`

#### Returns

`null` \| \{ `url`: `string`; \}

An object containing the `url` of the picture

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`picture`](RdfDocument.md#picture)

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:87](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L87)

Returns all the links from this thing to other resources

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

Defined in: [thing/Thing.ts:107](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L107)

Returns all the links from other resources to this thing

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

Defined in: [rdf-document/RdfDocument.ts:17](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/rdf-document/RdfDocument.ts#L17)

#### Returns

`object`[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`subjects`](RdfDocument.md#subjects)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:214](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L214)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`RdfDocument`](RdfDocument.md).[`types`](RdfDocument.md#types)
