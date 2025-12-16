# pos-type-index-entries

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `uri`    | `uri`     |             | `string` | `undefined` |


## Dependencies

### Used by

 - [pos-app-dashboard](../../apps/pos-app-dashboard)

### Depends on

- [pos-predicate](../pos-predicate)
- [pos-rich-link](../pos-rich-link)

### Graph
```mermaid
graph TD;
  pos-type-index-entries --> pos-predicate
  pos-type-index-entries --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-app-dashboard --> pos-type-index-entries
  style pos-type-index-entries fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
