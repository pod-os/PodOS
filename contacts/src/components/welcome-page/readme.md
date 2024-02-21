# pos-contacts-welcome-page



<!-- Auto Generated Below -->


## Events

| Event                               | Description | Type                  |
| ----------------------------------- | ----------- | --------------------- |
| `pod-os-contacts:open-address-book` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [pos-contacts-router](../router)

### Depends on

- pos-login

### Graph
```mermaid
graph TD;
  pos-contacts-welcome-page --> pos-login
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-login --> ion-button
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  ion-button --> ion-ripple-effect
  pos-contacts-router --> pos-contacts-welcome-page
  style pos-contacts-welcome-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
