# pos-navigation

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                         | Type     | Default |
| -------- | --------- | ----------------------------------- | -------- | ------- |
| `uri`    | `uri`     | Initial value of the navigation bar | `string` | `''`    |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |
| `pod-os:link` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- [pos-navigation-bar](bar)
- [pos-rich-link](../pos-rich-link)

### Graph
```mermaid
graph TD;
  pos-navigation --> pos-navigation-bar
  pos-navigation --> pos-rich-link
  pos-navigation-bar --> pos-make-findable
  pos-navigation-bar --> pos-share
  pos-make-findable --> pos-resource
  pos-make-findable --> pos-label
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-app-browser --> pos-navigation
  style pos-navigation fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
