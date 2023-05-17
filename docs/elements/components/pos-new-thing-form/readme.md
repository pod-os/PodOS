# pos-new-thing-form



<!-- Auto Generated Below -->


## Properties

| Property                    | Attribute       | Description | Type     | Default     |
| --------------------------- | --------------- | ----------- | -------- | ----------- |
| `referenceUri` _(required)_ | `reference-uri` |             | `string` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-add-new-thing](../pos-add-new-thing)

### Depends on

- [pos-select-term](../pos-select-term)

### Graph
```mermaid
graph TD;
  pos-new-thing-form --> pos-select-term
  pos-add-new-thing --> pos-new-thing-form
  style pos-new-thing-form fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
