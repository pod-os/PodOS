# pos-rich-link



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `uri`    | `uri`     |             | `string` | `undefined` |


## Dependencies

### Used by

 - [pos-relations](../pos-relations)

### Depends on

- [pos-resource](../pos-resource)
- ion-item
- ion-label
- [pos-label](../pos-label)
- [pos-description](../pos-description)

### Graph
```mermaid
graph TD;
  pos-rich-link --> pos-resource
  pos-rich-link --> ion-item
  pos-rich-link --> ion-label
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  pos-relations --> pos-rich-link
  style pos-rich-link fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
