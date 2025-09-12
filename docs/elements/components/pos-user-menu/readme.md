# pos-user-menu

<!-- Auto Generated Below -->


## Properties

| Property             | Attribute | Description | Type     | Default     |
| -------------------- | --------- | ----------- | -------- | ----------- |
| `webId` _(required)_ | `web-id`  |             | `string` | `undefined` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `pod-os:link`   |             | `CustomEvent<any>` |
| `pod-os:logout` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- [pos-resource](../pos-resource)
- [pos-picture](../pos-picture)
- [pos-label](../pos-label)

### Graph
```mermaid
graph TD;
  pos-user-menu --> pos-resource
  pos-user-menu --> pos-picture
  pos-user-menu --> pos-label
  pos-resource --> ion-progress-bar
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  pos-app-browser --> pos-user-menu
  style pos-user-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
