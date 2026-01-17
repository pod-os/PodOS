[**@pod-os/core**](../README.md)

***

[@pod-os/core](../globals.md) / ProfileGateway

# Class: ProfileGateway

Defined in: [profile/ProfileGateway.ts:8](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/profile/ProfileGateway.ts#L8)

Gateway for profile-related operations on Solid Pods and the store.

## Since

0.24.0

## Constructors

### Constructor

> **new ProfileGateway**(`store`): `ProfileGateway`

Defined in: [profile/ProfileGateway.ts:9](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/profile/ProfileGateway.ts#L9)

#### Parameters

##### store

[`Store`](Store.md)

#### Returns

`ProfileGateway`

## Methods

### fetchProfile()

> **fetchProfile**(`webId`): `Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

Defined in: [profile/ProfileGateway.ts:17](https://github.com/pod-os/PodOS/blob/e80e47e090ea2a3c5a790a9e1634789ca61341b8/core/src/profile/ProfileGateway.ts#L17)

Fetches the profile for the given WebID and all linked documents

#### Parameters

##### webId

`string`

The WebID to fetch the profile for

#### Returns

`Promise`\<[`WebIdProfile`](WebIdProfile.md)\>

The fetched profile

#### Since

0.24.0
