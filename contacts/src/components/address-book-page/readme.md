# pos-contacts-address-book-page



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute | Description | Type             | Default     |
| ---------------- | --------- | ----------- | ---------------- | ----------- |
| `contactsModule` | --        |             | `ContactsModule` | `undefined` |
| `uri`            | `uri`     |             | `string`         | `undefined` |


## Dependencies

### Used by

 - [pos-contacts-router](../router)

### Depends on

- ion-icon
- pos-login
- [pos-contacts-group-list](../group-list)
- [pos-contacts-contact-details](../contact-details)
- [pos-contacts-group-details](../contact-details/group-details)
- [pos-contacts-contact-list](../contact-list)

### Graph
```mermaid
graph TD;
  pos-contacts-address-book-page --> ion-icon
  pos-contacts-address-book-page --> pos-login
  pos-contacts-address-book-page --> pos-contacts-group-list
  pos-contacts-address-book-page --> pos-contacts-contact-details
  pos-contacts-address-book-page --> pos-contacts-group-details
  pos-contacts-address-book-page --> pos-contacts-contact-list
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
  pos-contacts-contact-details --> pos-contacts-phone-numbers
  pos-contacts-contact-details --> pos-contacts-email-addresses
  pos-contacts-router --> pos-contacts-address-book-page
  style pos-contacts-address-book-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
