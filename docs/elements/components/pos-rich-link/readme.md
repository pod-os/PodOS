# pos-rich-link



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `uri`    | `uri`     |             | `string` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:link` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-example-resources](../../apps/pos-app-dashboard/pos-example-resources)
 - [pos-navigation-bar](../pos-navigation-bar)
 - [pos-relations](../pos-relations)
 - [pos-reverse-relations](../pos-reverse-relations)
 - [pos-subjects](../pos-subjects)

### Depends on

- [pos-resource](../pos-resource)
- [pos-label](../pos-label)
- [pos-description](../pos-description)

### Graph
```mermaid
graph TD;
  pos-rich-link --> pos-resource
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  pos-example-resources --> pos-rich-link
  pos-navigation-bar --> pos-rich-link
  pos-relations --> pos-rich-link
  pos-reverse-relations --> pos-rich-link
  pos-subjects --> pos-rich-link
  style pos-rich-link fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
