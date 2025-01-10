# pos-container-item



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-ldp-container](../../apps/pos-app-ldp-container)

### Depends on

- [pos-resource](../pos-resource)
- [pos-container-item](.)
- ion-label
- ion-list

### Graph
```mermaid
graph TD;
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
  pos-app-ldp-container --> pos-container-contents
  style pos-container-contents fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
