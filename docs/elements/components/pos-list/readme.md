# pos-list

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                       | Type      | Default     |
| -------- | --------- | ----------------------------------------------------------------- | --------- | ----------- |
| `fetch`  | `fetch`   | Whether listed resources should be fetched before being displayed | `boolean` | `false`     |
| `rel`    | `rel`     | URI of the predicate to follow                                    | `string`  | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [pos-resource](../pos-resource)

### Graph
```mermaid
graph TD;
  pos-list --> pos-resource
  pos-resource --> ion-progress-bar
  style pos-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
