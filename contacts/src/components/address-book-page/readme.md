# pos-contacts-address-book-page



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute | Description | Type             | Default     |
| ------------------ | --------- | ----------- | ---------------- | ----------- |
| `contactsModule`   | --        |             | `ContactsModule` | `undefined` |
| `uri` _(required)_ | `uri`     |             | `string`         | `undefined` |


## Dependencies

### Used by

 - [pos-contacts-router](../router)

### Depends on

- pos-login
- [pos-contacts-loading-spinner](../loading-spinner)
- [pos-contacts-create-new-contact](../create-new-contact)
- [pos-contacts-group-list](../group-list)
- [pos-contacts-contact-details](../contact-details)
- [pos-contacts-group-details](../contact-details/group-details)
- [pos-contacts-contact-list](../contact-list)

### Graph
```mermaid
graph TD;
  pos-contacts-address-book-page --> pos-login
  pos-contacts-address-book-page --> pos-contacts-loading-spinner
  pos-contacts-address-book-page --> pos-contacts-create-new-contact
  pos-contacts-address-book-page --> pos-contacts-group-list
  pos-contacts-address-book-page --> pos-contacts-contact-details
  pos-contacts-address-book-page --> pos-contacts-group-details
  pos-contacts-address-book-page --> pos-contacts-contact-list
  pos-login --> pos-dialog
  pos-login --> pos-login-form
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-picture --> pos-upload
  pos-picture --> pos-image
  pos-contacts-create-new-contact --> pos-dialog
  pos-contacts-create-new-contact --> pos-contacts-create-new-contact-form
  pos-contacts-contact-details --> pos-contacts-loading-spinner
  pos-contacts-contact-details --> pos-contacts-phone-numbers
  pos-contacts-contact-details --> pos-contacts-email-addresses
  pos-contacts-router --> pos-contacts-address-book-page
  style pos-contacts-address-book-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
