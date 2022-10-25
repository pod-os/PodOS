# pos-login



<!-- Auto Generated Below -->


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-demo-app](../pos-demo-app)

### Depends on

- [pos-resource](../pos-resource)
- [pos-picture](../pos-picture)
- [pos-label](../pos-label)
- ion-button

### Graph
```mermaid
graph TD;
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-login --> ion-button
  pos-resource --> ion-progress-bar
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  ion-button --> ion-ripple-effect
  pos-demo-app --> pos-login
  style pos-login fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
