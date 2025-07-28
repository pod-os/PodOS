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

### Graph
```mermaid
graph TD;
  pos-container-contents --> pos-resource
  pos-container-contents --> pos-container-item
  pos-resource --> ion-progress-bar
  pos-container-item --> ion-icon
  pos-app-ldp-container --> pos-container-contents
  style pos-container-contents fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
