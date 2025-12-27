# pos-contacts-list-address-books



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute | Description | Type     | Default     |
| -------------------- | --------- | ----------- | -------- | ----------- |
| `webId` _(required)_ | `web-id`  |             | `string` | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `pod-os:link`   |             | `CustomEvent<any>` |
| `pod-os:module` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-contacts-open-address-book](../open-address-book)

### Depends on

- pos-resource
- pos-label

### Graph
```mermaid
graph TD;
  pos-contacts-list-address-books --> pos-resource
  pos-contacts-list-address-books --> pos-label
  pos-contacts-open-address-book --> pos-contacts-list-address-books
  style pos-contacts-list-address-books fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
