# pos-navigation-bar

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
- [pos-share](../../pos-share)

### Graph
```mermaid
graph TD;
  pos-navigation-bar --> pos-make-findable
  pos-navigation-bar --> pos-share
  pos-make-findable --> pos-resource
  pos-make-findable --> pos-label
  pos-navigation --> pos-navigation-bar
  style pos-navigation-bar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
