
<!-- Auto Generated Below -->


## Properties

| Property           | Attribute | Description | Type     | Default     |
| ------------------ | --------- | ----------- | -------- | ----------- |
| `uri` _(required)_ | `uri`     |             | `string` | `undefined` |


## Events

| Event                         | Description | Type               |
| ----------------------------- | ----------- | ------------------ |
| `pod-os:error`                |             | `CustomEvent<any>` |
| `pod-os:init`                 |             | `CustomEvent<any>` |
| `pod-os:search:index-created` |             | `CustomEvent<any>` |
| `pod-os:search:index-updated` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-navigation](../pos-navigation)

### Depends on

- [pos-resource](../pos-resource)
- [pos-label](../pos-label)

### Graph
```mermaid
graph TD;
  pos-make-findable --> pos-resource
  pos-make-findable --> pos-label
  pos-resource --> ion-progress-bar
  pos-navigation --> pos-make-findable
  style pos-make-findable fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
