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
 - [pos-app-rdf-document](../../apps/pos-app-rdf-document)

### Depends on

- ion-item-group
- ion-item-divider
- ion-label
- ion-item
- ion-list

### Graph
```mermaid
graph TD;
  pos-literals --> ion-item-group
  pos-literals --> ion-item-divider
  pos-literals --> ion-label
  pos-literals --> ion-item
  pos-literals --> ion-list
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  pos-app-generic --> pos-literals
  pos-app-image-viewer --> pos-literals
  pos-app-rdf-document --> pos-literals
  style pos-literals fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
