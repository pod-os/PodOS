[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / RdfDocument

# Class: RdfDocument

Defined in: [rdf-document/RdfDocument.ts:8](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/rdf-document/RdfDocument.ts#L8)

## Extends

- [`Thing`](Thing.md)

## Extended by

- [`LabelIndex`](LabelIndex.md)

## Constructors

### Constructor

> **new RdfDocument**(`uri`, `store`, `editable`): `RdfDocument`

Defined in: [rdf-document/RdfDocument.ts:9](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/rdf-document/RdfDocument.ts#L9)

#### Parameters

##### uri

`string`

##### store

`IndexedFormula`

##### editable

`boolean` = `false`

#### Returns

`RdfDocument`

#### Overrides

[`Thing`](Thing.md).[`constructor`](Thing.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [rdf-document/RdfDocument.ts:12](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/rdf-document/RdfDocument.ts#L12)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: `IndexedFormula`

Defined in: [rdf-document/RdfDocument.ts:11](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/rdf-document/RdfDocument.ts#L11)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [rdf-document/RdfDocument.ts:10](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/rdf-document/RdfDocument.ts#L10)

#### Inherited from

[`Thing`](Thing.md).[`uri`](Thing.md#uri)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:127](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L127)

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

Defined in: [thing/Thing.ts:227](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L227)

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

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:140](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L140)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`Thing`](Thing.md).[`description`](Thing.md#description)

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:47](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L47)

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

Defined in: [thing/Thing.ts:70](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L70)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`Thing`](Thing.md).[`literals`](Thing.md#literals)

***

### picture()

> **picture**(): \{ `url`: `string`; \} \| `null`

Defined in: [thing/Thing.ts:161](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L161)

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

Defined in: [thing/Thing.ts:87](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L87)

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

Defined in: [thing/Thing.ts:107](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L107)

Returns all the links from other resources to this thing

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

Defined in: [rdf-document/RdfDocument.ts:17](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/rdf-document/RdfDocument.ts#L17)

#### Returns

`object`[]

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:214](https://github.com/pod-os/PodOS/blob/de9215ad8ec55ee6f58ed59e3dc31dc7c0c3e462/core/src/thing/Thing.ts#L214)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
