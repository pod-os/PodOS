# pos-contacts-create-new-contact



<!-- Auto Generated Below -->


## Properties

| Property                      | Attribute          | Description | Type     | Default     |
| ----------------------------- | ------------------ | ----------- | -------- | ----------- |
| `addressBookUri` _(required)_ | `address-book-uri` |             | `string` | `undefined` |


## Dependencies

### Used by

 - [pos-contacts-address-book-page](../address-book-page)

### Depends on

- ion-icon
- pos-dialog
- [pos-contacts-create-new-contact-form](../create-new-contact-form)

### Graph
```mermaid
graph TD;
  pos-contacts-create-new-contact --> ion-icon
  pos-contacts-create-new-contact --> pos-dialog
  pos-contacts-create-new-contact --> pos-contacts-create-new-contact-form
  pos-dialog --> ion-icon
  pos-contacts-address-book-page --> pos-contacts-create-new-contact
  style pos-contacts-create-new-contact fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
