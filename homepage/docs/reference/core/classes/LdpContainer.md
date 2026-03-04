[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / LdpContainer

# Class: LdpContainer

Defined in: [ldp-container/LdpContainer.ts:10](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L10)

## Extends

- [`Thing`](Thing.md)

## Constructors

### Constructor

> **new LdpContainer**(`uri`, `store`, `editable?`): `LdpContainer`

Defined in: [ldp-container/LdpContainer.ts:11](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L11)

#### Parameters

##### uri

`string`

##### store

[`Store`](Store.md)

##### editable?

`boolean` = `false`

#### Returns

`LdpContainer`

#### Overrides

[`Thing`](Thing.md).[`constructor`](Thing.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [ldp-container/LdpContainer.ts:14](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L14)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [ldp-container/LdpContainer.ts:13](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L13)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [ldp-container/LdpContainer.ts:12](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L12)

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

### contains()

> **contains**(): [`ContainerContent`](../interfaces/ContainerContent.md)[]

Defined in: [ldp-container/LdpContainer.ts:24](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L24)

Resources that the LDP Container contains

#### Returns

[`ContainerContent`](../interfaces/ContainerContent.md)[]

Array of objects with uri and name

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

### observeContains()

> **observeContains**(): `Observable`\<[`ContainerContent`](../interfaces/ContainerContent.md)[]\>

Defined in: [ldp-container/LdpContainer.ts:42](https://github.com/pod-os/PodOS/blob/main/core/src/ldp-container/LdpContainer.ts#L42)

Observe changes to the resources that the LDP Container contains

#### Returns

`Observable`\<[`ContainerContent`](../interfaces/ContainerContent.md)[]\>

RxJS Observable that pushes a new contains() array when it changes

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

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:270](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L270)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
