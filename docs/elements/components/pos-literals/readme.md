# pos-literals



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-generic](../../apps/pos-app-generic)
 - [pos-app-image-viewer](../../apps/pos-app-image-viewer)
 - [pos-app-ldp-container](../../apps/pos-app-ldp-container)
 - [pos-app-rdf-document](../../apps/pos-app-rdf-document)

### Depends on

- [pos-predicate](../pos-predicate)
- [pos-add-literal-value](../pos-add-literal-value)

### Graph
```mermaid
graph TD;
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-add-literal-value --> pos-select-term
  pos-app-generic --> pos-literals
  pos-app-image-viewer --> pos-literals
  pos-app-ldp-container --> pos-literals
  pos-app-rdf-document --> pos-literals
  style pos-literals fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
