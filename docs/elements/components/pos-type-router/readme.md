# pos-type-router



<!-- Auto Generated Below -->


## Overview

This component is responsible for rendering tools that are useful to interact with the current resource.

## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- [pos-tool-select](../pos-tool-select)

### Graph
```mermaid
graph TD;
  pos-type-router --> pos-tool-select
  pos-app-browser --> pos-type-router
  style pos-type-router fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
