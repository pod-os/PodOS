# pos-contacts-list-address-books



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute | Description | Type     | Default     |
| -------------------- | --------- | ----------- | -------- | ----------- |
| `webId` _(required)_ | `web-id`  |             | `string` | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `pod-os:module` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-contacts-open-address-book](../open-address-book)

### Depends on

- pos-rich-link

### Graph
```mermaid
graph TD;
  pos-contacts-list-address-books --> pos-rich-link
  pos-rich-link --> pos-resource
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-contacts-open-address-book --> pos-contacts-list-address-books
  style pos-contacts-list-address-books fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
