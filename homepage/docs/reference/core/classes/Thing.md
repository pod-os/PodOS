[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Thing

# Class: Thing

Defined in: [thing/Thing.ts:76](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L76)

## Extended by

- [`RdfDocument`](RdfDocument.md)
- [`LdpContainer`](LdpContainer.md)
- [`WebIdProfile`](WebIdProfile.md)
- [`TypeIndex`](TypeIndex.md)

## Constructors

### Constructor

> **new Thing**(`uri`, `store`, `editable?`): `Thing`

Defined in: [thing/Thing.ts:84](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L84)

#### Parameters

##### uri

`string`

##### store

[`Store`](Store.md)

##### editable?

`boolean` = `false`

#### Returns

`Thing`

## Properties

### editable

> `readonly` **editable**: `boolean`

Defined in: [thing/Thing.ts:82](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L82)

Whether the Thing can be edited according to its access control settings

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [thing/Thing.ts:78](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L78)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:77](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L77)

## Methods

### anyValue()

> **anyValue**(...`predicateUris`): `undefined`

Defined in: [thing/Thing.ts:219](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L219)

Returns any value linked from this thing via one of the given predicates

#### Parameters

##### predicateUris

...`string`[]

#### Returns

`undefined`

***

### assume()

> **assume**\<`T`\>(`SpecificThing`): `T`

Defined in: [thing/Thing.ts:406](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L406)

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

Defined in: [thing/Thing.ts:387](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L387)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

***

### container()

> **container**(): `object`

Defined in: [thing/Thing.ts:416](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L416)

Returns the container that contains this thing's document
The container URI is derived from the thing's URI.

#### Returns

`object`

##### uri

> **uri**: `string`

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:286](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L286)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:96](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L96)

Returns a human-readable label for this thing. Tries to match common RDF terms
used for labels, such as `rdfs:label`, `schema:name` and others.

If no such term is present, it will derive a label from the URI.

#### Returns

`string`

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:116](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L116)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

***

### observeAnyValue()

> **observeAnyValue**(...`predicateUris`): `Observable`\<`string` \| `undefined`\>

Defined in: [thing/Thing.ts:235](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L235)

Observe changes in a value linked from this thing via one of the given predicates

Note that return value may differ from that from `anyValue` when more than one value is present.

#### Parameters

##### predicateUris

...`string`[]

#### Returns

`Observable`\<`string` \| `undefined`\>

***

### observeDescription()

> **observeDescription**(): `Observable`\<`string` \| `undefined`\>

Defined in: [thing/Thing.ts:293](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L293)

Observe changes in literal values that describe this thing. See `description`

#### Returns

`Observable`\<`string` \| `undefined`\>

***

### observeLabel()

> **observeLabel**(): `Observable`\<`string`\>

Defined in: [thing/Thing.ts:107](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L107)

Observe changes in human-readable label for this thing. See `label`.

#### Returns

`Observable`\<`string`\>

***

### observeRelations()

> **observeRelations**(`predicate?`): `Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

Defined in: [thing/Thing.ts:153](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L153)

Observe changes in links from this thing to other resources

#### Parameters

##### predicate?

`string`

#### Returns

`Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

***

### observeReverseRelations()

> **observeReverseRelations**(`predicate?`): `Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

Defined in: [thing/Thing.ts:195](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L195)

Observe changes in links from other resources to this thing

#### Parameters

##### predicate?

`string`

#### Returns

`Observable`\<[`Relation`](../interfaces/Relation.md)[]\>

***

### observeTypes()

> **observeTypes**(): `Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

Defined in: [thing/Thing.ts:368](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L368)

Observe changes to the list of RDF types for this thing

#### Returns

`Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

***

### picture()

> **picture**(): \{ `url`: `string`; \} \| `null`

Defined in: [thing/Thing.ts:304](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L304)

Returns the url of a picture or logo associated with this thing
Tries to match common RDF terms used for pictures like `schema:image`,
`vcard:photo` or `foaf:img`

#### Returns

\{ `url`: `string`; \} \| `null`

An object containing the `url` of the picture

***

### relations()

> **relations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:133](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L133)

Returns all the unique links from this thing to other resources. This only includes named nodes and excludes rdf:type relations.

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

***

### reverseRelations()

> **reverseRelations**(`predicate?`): [`Relation`](../interfaces/Relation.md)[]

Defined in: [thing/Thing.ts:176](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L176)

Returns all the unique links from other resources to this thing

#### Parameters

##### predicate?

`string`

#### Returns

[`Relation`](../interfaces/Relation.md)[]

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:357](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L357)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]
