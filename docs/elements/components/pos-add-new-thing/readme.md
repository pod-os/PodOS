# pos-add-new-thing



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute       | Description | Type     | Default     |
| --------------------------- | --------------- | ----------- | -------- | ----------- |
| `referenceUri` _(required)_ | `reference-uri` |             | `string` | `undefined` |


## Dependencies

### Used by

 - [pos-router](../pos-router)

### Depends on

- ion-icon
- [pos-new-thing-form](../pos-new-thing-form)

### Graph
```mermaid
graph TD;
  pos-add-new-thing --> ion-icon
  pos-add-new-thing --> pos-new-thing-form
  pos-new-thing-form --> pos-select-term
  pos-router --> pos-add-new-thing
  style pos-add-new-thing fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
