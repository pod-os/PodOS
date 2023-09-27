# pos-app-ldp-container



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- ion-grid
- ion-row
- ion-col
- [pos-container-contents](../../components/pos-container-contents)
- [pos-subjects](../../components/pos-subjects)
- ion-card
- ion-card-header
- ion-card-title
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-ldp-container --> ion-grid
  pos-app-ldp-container --> ion-row
  pos-app-ldp-container --> ion-col
  pos-app-ldp-container --> pos-container-contents
  pos-app-ldp-container --> pos-subjects
  pos-app-ldp-container --> ion-card
  pos-app-ldp-container --> ion-card-header
  pos-app-ldp-container --> ion-card-title
  pos-app-ldp-container --> pos-label
  pos-app-ldp-container --> pos-type-badges
  pos-app-ldp-container --> pos-literals
  pos-container-contents --> pos-resource
  pos-container-contents --> pos-container-item
  pos-container-contents --> ion-label
  pos-container-contents --> ion-list
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-container-item --> ion-item
  pos-container-item --> ion-icon
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  ion-item --> ion-note
  pos-subjects --> pos-rich-link
  pos-subjects --> ion-list
  pos-rich-link --> pos-resource
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-type-badges --> ion-badge
  pos-type-badges --> ion-icon
  pos-literals --> ion-item-group
  pos-literals --> ion-item-divider
  pos-literals --> ion-label
  pos-literals --> ion-item
  pos-literals --> ion-list
  pos-literals --> pos-add-literal-value
  pos-add-literal-value --> ion-icon
  pos-add-literal-value --> pos-select-term
  pos-add-literal-value --> ion-input
  ion-input --> ion-icon
  style pos-app-ldp-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
