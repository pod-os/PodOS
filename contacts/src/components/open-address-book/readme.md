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

### Graph
```mermaid
graph TD;
  pos-contacts-open-address-book --> pos-contacts-list-address-books
  pos-contacts-open-address-book --> pos-login
  pos-contacts-list-address-books --> pos-resource
  pos-contacts-list-address-books --> pos-label
  pos-login --> pos-dialog
  pos-login --> pos-login-form
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-picture --> pos-upload
  pos-picture --> pos-image
  pos-contacts-welcome-page --> pos-contacts-open-address-book
  style pos-contacts-open-address-book fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
