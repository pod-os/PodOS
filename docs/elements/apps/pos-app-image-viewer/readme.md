# pos-app-image-viewer



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
- [pos-image](../../components/pos-image)
- ion-card
- ion-card-header
- ion-card-title
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-image-viewer --> ion-grid
  pos-app-image-viewer --> ion-row
  pos-app-image-viewer --> ion-col
  pos-app-image-viewer --> pos-image
  pos-app-image-viewer --> ion-card
  pos-app-image-viewer --> ion-card-header
  pos-app-image-viewer --> ion-card-title
  pos-app-image-viewer --> pos-label
  pos-app-image-viewer --> pos-type-badges
  pos-app-image-viewer --> pos-literals
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  ion-card --> ion-ripple-effect
  pos-type-badges --> ion-badge
  pos-type-badges --> ion-icon
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-predicate --> ion-icon
  pos-add-literal-value --> ion-icon
  pos-add-literal-value --> pos-select-term
  pos-add-literal-value --> ion-input
  ion-input --> ion-icon
  style pos-app-image-viewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
