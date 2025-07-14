
<!-- Auto Generated Below -->


## Properties

| Property           | Attribute            | Description | Type      | Default     |
| ------------------ | -------------------- | ----------- | --------- | ----------- |
| `current`          | --                   |             | `Thing`   | `undefined` |
| `searchIndexReady` | `search-index-ready` |             | `boolean` | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:navigate` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-navigation](..)

### Depends on

- [pos-make-findable](../../pos-make-findable)

### Graph
```mermaid
graph TD;
  pos-navigation-bar --> pos-make-findable
  pos-make-findable --> pos-resource
  pos-make-findable --> pos-label
  pos-resource --> ion-progress-bar
  pos-navigation --> pos-navigation-bar
  style pos-navigation-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
