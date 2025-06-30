# pos-app-document-viewer



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [pos-document](../../components/pos-document)
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-document-viewer --> pos-document
  pos-app-document-viewer --> pos-label
  pos-app-document-viewer --> pos-type-badges
  pos-app-document-viewer --> pos-literals
  pos-document --> ion-skeleton-text
  pos-document --> ion-icon
  pos-type-badges --> ion-badge
  pos-type-badges --> ion-icon
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-predicate --> ion-icon
  pos-add-literal-value --> ion-icon
  pos-add-literal-value --> pos-select-term
  style pos-app-document-viewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
