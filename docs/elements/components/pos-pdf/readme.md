# pos-pdf



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `alt`    | `alt`     |             | `string` | `undefined` |
| `src`    | `src`     |             | `string` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-pdf-viewer](../../apps/pos-app-pdf-viewer)

### Depends on

- ion-skeleton-text
- ion-icon

### Graph
```mermaid
graph TD;
  pos-pdf --> ion-skeleton-text
  pos-pdf --> ion-icon
  pos-app-pdf-viewer --> pos-pdf
  style pos-pdf fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
