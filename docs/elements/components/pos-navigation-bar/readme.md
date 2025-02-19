# pos-navigation-bar



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default |
| -------- | --------- | ----------- | -------- | ------- |
| `uri`    | `uri`     |             | `string` | `''`    |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |
| `pod-os:link` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- [pos-make-findable](../pos-make-findable)
- ion-searchbar
- [pos-rich-link](../pos-rich-link)

### Graph
```mermaid
graph TD;
  pos-navigation-bar --> pos-make-findable
  pos-navigation-bar --> ion-searchbar
  pos-navigation-bar --> pos-rich-link
  pos-make-findable --> pos-resource
  pos-make-findable --> pos-label
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  ion-searchbar --> ion-icon
  pos-rich-link --> pos-resource
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-app-browser --> pos-navigation-bar
  style pos-navigation-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
