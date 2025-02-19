# pos-resource



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type      | Default     |
| -------- | --------- | ----------- | --------- | ----------- |
| `lazy`   | `lazy`    |             | `boolean` | `false`     |
| `uri`    | `uri`     |             | `string`  | `undefined` |


## Events

| Event                    | Description                                                          | Type               |
| ------------------------ | -------------------------------------------------------------------- | ------------------ |
| `pod-os:init`            |                                                                      | `CustomEvent<any>` |
| `pod-os:resource-loaded` | Indicates that the resource given in `uri` property has been loaded. | `CustomEvent<any>` |


## Methods

### `fetch() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)
 - [pos-container-contents](../pos-container-contents)
 - [pos-login](../pos-login)
 - [pos-make-findable](../pos-make-findable)
 - [pos-rich-link](../pos-rich-link)

### Depends on

- ion-progress-bar
- ion-card
- ion-card-header
- ion-card-content

### Graph
```mermaid
graph TD;
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-app-browser --> pos-resource
  pos-container-contents --> pos-resource
  pos-login --> pos-resource
  pos-make-findable --> pos-resource
  pos-rich-link --> pos-resource
  style pos-resource fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
