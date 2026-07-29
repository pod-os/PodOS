[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / Quad

# Interface: Quad\<S, P, O, G\>

Defined in: node\_modules/rdflib/lib/tf-types.d.ts:43

RDF/JS spec Quad

## Link

https://rdf.js.org/data-model-spec/#quad-interface

## Type Parameters

### S

`S` *extends* `Term` = `Quad_Subject`

### P

`P` *extends* `Term` = `Quad_Predicate`

### O

`O` *extends* `Term` = `Quad_Object`

### G

`G` *extends* `Term` = `Quad_Graph`

## Properties

### graph

> **graph**: `G`

Defined in: node\_modules/rdflib/lib/tf-types.d.ts:47

***

### object

> **object**: `O`

Defined in: node\_modules/rdflib/lib/tf-types.d.ts:46

***

### predicate

> **predicate**: `P`

Defined in: node\_modules/rdflib/lib/tf-types.d.ts:45

***

### subject

> **subject**: `S`

Defined in: node\_modules/rdflib/lib/tf-types.d.ts:44

## Methods

### equals()

> **equals**(`other`): `boolean`

Defined in: node\_modules/rdflib/lib/tf-types.d.ts:48

#### Parameters

##### other

`BaseQuad`

#### Returns

`boolean`
