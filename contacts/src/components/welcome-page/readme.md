# pos-contacts-welcome-page



<!-- Auto Generated Below -->


## Dependencies

### Used by

 - [pos-contacts-router](../router)

### Depends on

- pos-login
- [pos-contacts-open-address-book](../open-address-book)

### Graph
```mermaid
graph TD;
  pos-contacts-welcome-page --> pos-login
  pos-contacts-welcome-page --> pos-contacts-open-address-book
  pos-login --> pos-dialog
  pos-login --> pos-login-form
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-picture --> pos-upload
  pos-picture --> pos-image
  pos-contacts-open-address-book --> pos-contacts-list-address-books
  pos-contacts-open-address-book --> pos-login
  pos-contacts-list-address-books --> pos-resource
  pos-contacts-list-address-books --> pos-label
  pos-contacts-router --> pos-contacts-welcome-page
  style pos-contacts-welcome-page fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
