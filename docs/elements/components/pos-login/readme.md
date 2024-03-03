# pos-login



<!-- Auto Generated Below -->


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- [pos-resource](../pos-resource)
- [pos-picture](../pos-picture)
- [pos-label](../pos-label)
- [pos-dialog](../pos-dialog)
- [pos-login-form](../pos-login-form)

### Graph
```mermaid
graph TD;
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-login --> pos-dialog
  pos-login --> pos-login-form
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  pos-dialog --> ion-icon
  pos-app-browser --> pos-login
  style pos-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
