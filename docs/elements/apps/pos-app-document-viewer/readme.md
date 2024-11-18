# pos-app-document-viewer



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- ion-grid
- ion-row
- ion-col
- [pos-document](../../components/pos-document)
- ion-card
- ion-card-header
- ion-card-title
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-document-viewer --> ion-grid
  pos-app-document-viewer --> ion-row
  pos-app-document-viewer --> ion-col
  pos-app-document-viewer --> pos-document
  pos-app-document-viewer --> ion-card
  pos-app-document-viewer --> ion-card-header
  pos-app-document-viewer --> ion-card-title
  pos-app-document-viewer --> pos-label
  pos-app-document-viewer --> pos-type-badges
  pos-app-document-viewer --> pos-literals
  pos-document --> ion-skeleton-text
  pos-document --> ion-icon
  ion-card --> ion-ripple-effect
  pos-type-badges --> ion-badge
  pos-type-badges --> ion-icon
  pos-literals --> ion-item-group
  pos-literals --> ion-item-divider
  pos-literals --> pos-predicate
  pos-literals --> ion-item
  pos-literals --> ion-label
  pos-literals --> ion-list
  pos-literals --> pos-add-literal-value
  pos-predicate --> ion-label
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-item --> ion-note
  pos-add-literal-value --> ion-icon
  pos-add-literal-value --> pos-select-term
  pos-add-literal-value --> ion-input
  ion-input --> ion-icon
  style pos-app-document-viewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
