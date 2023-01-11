# pos-app-pdf-viewer



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-type-router](../../components/pos-type-router)

### Depends on

- ion-grid
- ion-row
- ion-col
- [pos-pdf](../../components/pos-pdf)
- ion-card
- ion-card-header
- ion-card-title
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-pdf-viewer --> ion-grid
  pos-app-pdf-viewer --> ion-row
  pos-app-pdf-viewer --> ion-col
  pos-app-pdf-viewer --> pos-pdf
  pos-app-pdf-viewer --> ion-card
  pos-app-pdf-viewer --> ion-card-header
  pos-app-pdf-viewer --> ion-card-title
  pos-app-pdf-viewer --> pos-label
  pos-app-pdf-viewer --> pos-type-badges
  pos-app-pdf-viewer --> pos-literals
  pos-pdf --> ion-skeleton-text
  pos-pdf --> ion-icon
  ion-card --> ion-ripple-effect
  pos-type-badges --> ion-badge
  pos-type-badges --> ion-icon
  pos-literals --> ion-item-group
  pos-literals --> ion-item-divider
  pos-literals --> ion-label
  pos-literals --> ion-item
  pos-literals --> ion-list
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-item --> ion-note
  pos-type-router --> pos-app-pdf-viewer
  style pos-app-pdf-viewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
