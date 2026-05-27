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

Defined in: [profile/WebIdProfile.ts:13](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L13)

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

> `readonly` **editable**: `boolean`

Defined in: [thing/Thing.ts:82](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L82)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: [`Store`](Store.md)

Defined in: [thing/Thing.ts:78](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L78)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:77](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L77)

#### Inherited from

[`Thing`](Thing.md).[`uri`](Thing.md#uri)

***

### webId

> `readonly` **webId**: `string`

Defined in: [profile/WebIdProfile.ts:11](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L11)

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

#### Inherited from

[`Thing`](Thing.md).[`anyValue`](Thing.md#anyvalue)

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

#### Inherited from

[`Thing`](Thing.md).[`assume`](Thing.md#assume)

***

### attachments()

> **attachments**(): [`Attachment`](../interfaces/Attachment.md)[]

Defined in: [thing/Thing.ts:387](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L387)

Returns all attachments linked to this thing

#### Returns

[`Attachment`](../interfaces/Attachment.md)[]

#### Inherited from

[`Thing`](Thing.md).[`attachments`](Thing.md#attachments)

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

#### Inherited from

[`Thing`](Thing.md).[`container`](Thing.md#container)

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:286](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L286)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`Thing`](Thing.md).[`description`](Thing.md#description)

***

### getPreferencesFile()

> **getPreferencesFile**(): `string` \| `undefined`

Defined in: [profile/WebIdProfile.ts:22](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L22)

Returns the URI of the preferences document

#### Returns

`string` \| `undefined`

***

### getPrivateLabelIndexes()

> **getPrivateLabelIndexes**(): `string`[]

Defined in: [profile/WebIdProfile.ts:48](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L48)

Returns the URIs of the private label indexes

#### Returns

`string`[]

***

### getPrivateTypeIndex()

> **getPrivateTypeIndex**(): `string` \| `undefined`

Defined in: [profile/WebIdProfile.ts:38](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L38)

Returns the URI of the private type index document

#### Returns

`string` \| `undefined`

#### Since

0.24.0

***

### getPublicTypeIndex()

> **getPublicTypeIndex**(): `string` \| `undefined`

Defined in: [profile/WebIdProfile.ts:30](https://github.com/pod-os/PodOS/blob/main/core/src/profile/WebIdProfile.ts#L30)

Returns the URI of the public type index document

#### Returns

`string` \| `undefined`

#### Since

0.24.0

***

### label()

> **label**(): `string`

Defined in: [thing/Thing.ts:96](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L96)

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

Defined in: [thing/Thing.ts:116](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L116)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`Thing`](Thing.md).[`literals`](Thing.md#literals)

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

#### Inherited from

[`Thing`](Thing.md).[`observeAnyValue`](Thing.md#observeanyvalue)

***

### observeDescription()

> **observeDescription**(): `Observable`\<`string` \| `undefined`\>

Defined in: [thing/Thing.ts:293](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L293)

Observe changes in literal values that describe this thing. See `description`

#### Returns

`Observable`\<`string` \| `undefined`\>

#### Inherited from

[`Thing`](Thing.md).[`observeDescription`](Thing.md#observedescription)

***

### observeLabel()

> **observeLabel**(): `Observable`\<`string`\>

Defined in: [thing/Thing.ts:107](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L107)

Observe changes in human-readable label for this thing. See `label`.

#### Returns

`Observable`\<`string`\>

#### Inherited from

[`Thing`](Thing.md).[`observeLabel`](Thing.md#observelabel)

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

#### Inherited from

[`Thing`](Thing.md).[`observeRelations`](Thing.md#observerelations)

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

#### Inherited from

[`Thing`](Thing.md).[`observeReverseRelations`](Thing.md#observereverserelations)

***

### observeTypes()

> **observeTypes**(): `Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

Defined in: [thing/Thing.ts:368](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L368)

Observe changes to the list of RDF types for this thing

#### Returns

`Observable`\<[`RdfType`](../interfaces/RdfType.md)[]\>

#### Inherited from

[`Thing`](Thing.md).[`observeTypes`](Thing.md#observetypes)

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

#### Inherited from

[`Thing`](Thing.md).[`picture`](Thing.md#picture)

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

#### Inherited from

[`Thing`](Thing.md).[`relations`](Thing.md#relations)

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

#### Inherited from

[`Thing`](Thing.md).[`reverseRelations`](Thing.md#reverserelations)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:357](https://github.com/pod-os/PodOS/blob/main/core/src/thing/Thing.ts#L357)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
