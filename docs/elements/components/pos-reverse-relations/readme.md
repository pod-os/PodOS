# pos-reverse-relations



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-generic](../../apps/pos-app-generic)

### Depends on

- [pos-predicate](../pos-predicate)
- [pos-rich-link](../pos-rich-link)

### Graph
```mermaid
graph TD;
  pos-reverse-relations --> pos-predicate
  pos-reverse-relations --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-app-generic --> pos-reverse-relations
  style pos-reverse-relations fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
