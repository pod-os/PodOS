# pos-subjects



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-ldp-container](../../apps/pos-app-ldp-container)
 - [pos-app-rdf-document](../../apps/pos-app-rdf-document)

### Depends on

- [pos-rich-link](../pos-rich-link)

### Graph
```mermaid
graph TD;
  pos-subjects --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-resource --> ion-progress-bar
  pos-app-ldp-container --> pos-subjects
  pos-app-rdf-document --> pos-subjects
  style pos-subjects fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
