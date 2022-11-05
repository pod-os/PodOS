# pos-navigation-bar



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `uri`    | `uri`     |             | `string` | `''`    |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:link` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-router](../pos-router)

### Depends on

- ion-searchbar

### Graph
```mermaid
graph TD;
  pos-navigation-bar --> ion-searchbar
  ion-searchbar --> ion-icon
  pos-router --> pos-navigation-bar
  style pos-navigation-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
