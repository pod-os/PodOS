[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / UriService

# Class: UriService

Defined in: [uri/UriService.ts:4](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/uri/UriService.ts#L4)

## Constructors

### Constructor

> **new UriService**(`store`): `UriService`

Defined in: [uri/UriService.ts:7](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/uri/UriService.ts#L7)

#### Parameters

##### store

[`Store`](Store.md)

#### Returns

`UriService`

## Methods

### proposeUriForNewThing()

> **proposeUriForNewThing**(`referenceUri`, `name`): `string`

Defined in: [uri/UriService.ts:17](https://github.com/pod-os/PodOS/blob/a5ceb94d91186b3cf4ceb28910e3f6d4c89dae68/core/src/uri/UriService.ts#L17)

Proposes a URI for a new thing based on what the referenceUri identifies:
- if a container, the new URI is in this container
- if a file, the new URI is in the same container as said file
- if a non-information-resource, the new URI is in the same container as that resource

#### Parameters

##### referenceUri

`string`

##### name

`string`

(will be slugified)

#### Returns

`string`
