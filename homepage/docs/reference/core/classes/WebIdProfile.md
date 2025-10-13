[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / WebIdProfile

# Class: WebIdProfile

Defined in: [profile/WebIdProfile.ts:7](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L7)

Allows to find things related to the WebID and their profile document

## Extends

- [`Thing`](Thing.md)

## Constructors

### Constructor

> **new WebIdProfile**(`webId`, `store`, `editable`): `WebIdProfile`

Defined in: [profile/WebIdProfile.ts:8](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L8)

#### Parameters

##### webId

`string`

##### store

`IndexedFormula`

##### editable

`boolean` = `false`

#### Returns

`WebIdProfile`

#### Overrides

[`Thing`](Thing.md).[`constructor`](Thing.md#constructor)

## Properties

### editable

> `readonly` **editable**: `boolean` = `false`

Defined in: [profile/WebIdProfile.ts:11](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L11)

Whether the Thing can be edited according to its access control settings

#### Inherited from

[`Thing`](Thing.md).[`editable`](Thing.md#editable)

***

### store

> `readonly` **store**: `IndexedFormula`

Defined in: [profile/WebIdProfile.ts:10](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L10)

#### Inherited from

[`Thing`](Thing.md).[`store`](Thing.md#store)

***

### uri

> `readonly` **uri**: `string`

Defined in: [thing/Thing.ts:33](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L33)

#### Inherited from

[`Thing`](Thing.md).[`uri`](Thing.md#uri)

***

### webId

> `readonly` **webId**: `string`

Defined in: [profile/WebIdProfile.ts:9](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L9)

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

[`Thing`](Thing.md).[`anyValue`](Thing.md#anyvalue)

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

[`Thing`](Thing.md).[`assume`](Thing.md#assume)

***

### description()

> **description**(): `undefined`

Defined in: [thing/Thing.ts:140](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L140)

Returns a literal value that describes this thing. Tries to match common RDF terms
used for descriptions, like `dct:description`, `schema:description` or `rdfs:comment`

#### Returns

`undefined`

#### Inherited from

[`Thing`](Thing.md).[`description`](Thing.md#description)

***

### getPreferencesFile()

> **getPreferencesFile**(): `string` \| `void`

Defined in: [profile/WebIdProfile.ts:19](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L19)

Returns te URI of the preferences document

#### Returns

`string` \| `void`

***

### getPrivateLabelIndexes()

> **getPrivateLabelIndexes**(): `string`[]

Defined in: [profile/WebIdProfile.ts:31](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/profile/WebIdProfile.ts#L31)

Returns the URIs of the private label indexes

#### Returns

`string`[]

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

[`Thing`](Thing.md).[`label`](Thing.md#label)

***

### literals()

> **literals**(): [`Literal`](../interfaces/Literal.md)[]

Defined in: [thing/Thing.ts:70](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L70)

Returns all the literal values that are linked to this thing

#### Returns

[`Literal`](../interfaces/Literal.md)[]

#### Inherited from

[`Thing`](Thing.md).[`literals`](Thing.md#literals)

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

[`Thing`](Thing.md).[`picture`](Thing.md#picture)

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

[`Thing`](Thing.md).[`relations`](Thing.md#relations)

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

[`Thing`](Thing.md).[`reverseRelations`](Thing.md#reverserelations)

***

### types()

> **types**(): [`RdfType`](../interfaces/RdfType.md)[]

Defined in: [thing/Thing.ts:214](https://github.com/pod-os/PodOS/blob/90fd10a51a0e6c116e360caca550a03a7f7126ea/core/src/thing/Thing.ts#L214)

Retrieves a list of RDF types for this thing.

#### Returns

[`RdfType`](../interfaces/RdfType.md)[]

#### Inherited from

[`Thing`](Thing.md).[`types`](Thing.md#types)
