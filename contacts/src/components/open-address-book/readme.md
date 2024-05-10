# pos-contacts-open-address-book



<!-- Auto Generated Below -->


## Events

| Event                               | Description | Type                  |
| ----------------------------------- | ----------- | --------------------- |
| `pod-os-contacts:open-address-book` |             | `CustomEvent<string>` |


## Dependencies

### Used by

 - [pos-contacts-welcome-page](../welcome-page)

### Depends on

- [pos-contacts-list-address-books](../list-address-books)
- pos-login
- ion-icon

### Graph
```mermaid
graph TD;
  pos-contacts-open-address-book --> pos-contacts-list-address-books
  pos-contacts-open-address-book --> pos-login
  pos-contacts-open-address-book --> ion-icon
  pos-contacts-list-address-books --> pos-rich-link
  pos-rich-link --> pos-resource
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-login --> pos-dialog
  pos-login --> pos-login-form
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-dialog --> ion-icon
  pos-contacts-welcome-page --> pos-contacts-open-address-book
  style pos-contacts-open-address-book fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
