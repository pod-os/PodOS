# pos-select-term



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type     | Default               |
| ------------- | ------------- | ----------- | -------- | --------------------- |
| `placeholder` | `placeholder` |             | `string` | `'Type to search...'` |


## Events

| Event                  | Description                              | Type               |
| ---------------------- | ---------------------------------------- | ------------------ |
| `pod-os:init`          |                                          | `CustomEvent<any>` |
| `pod-os:term-selected` | Fires when a term is entered or selected | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-add-literal-value](../pos-add-literal-value)

### Graph
```mermaid
graph TD;
  pos-add-literal-value --> pos-select-term
  style pos-select-term fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*