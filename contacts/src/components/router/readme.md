# pos-contacts-router



<!-- Auto Generated Below -->


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-contacts-app](..)

### Depends on

- [pos-contacts-welcome-page](../welcome-page)
- [pos-contacts-address-book-page](../address-book-page)
- [pos-contacts-contact](..)
- [pos-contacts-group](..)

### Graph
```mermaid
graph TD;
  pos-contacts-router --> pos-contacts-welcome-page
  pos-contacts-router --> pos-contacts-address-book-page
  pos-contacts-router --> pos-contacts-contact
  pos-contacts-router --> pos-contacts-group
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
  pos-contacts-address-book-page --> pos-login
  pos-contacts-address-book-page --> ion-icon
  pos-contacts-address-book-page --> pos-resource
  pos-contacts-address-book-page --> pos-contacts-loading-spinner
  pos-contacts-address-book-page --> pos-contacts-group-list
  pos-contacts-address-book-page --> pos-contacts-contact-details
  pos-contacts-address-book-page --> pos-contacts-group-details
  pos-contacts-address-book-page --> pos-contacts-contact-list
  pos-contacts-contact-details --> pos-contacts-loading-spinner
  pos-contacts-contact-details --> ion-icon
  pos-contacts-contact-details --> pos-contacts-phone-numbers
  pos-contacts-contact-details --> pos-contacts-email-addresses
  pos-contacts-phone-numbers --> ion-icon
  pos-contacts-email-addresses --> ion-icon
  pos-contacts-app --> pos-contacts-router
  style pos-contacts-router fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
