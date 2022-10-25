# pos-image



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default     |
| -------- | --------- | ----------- | -------- | ----------- |
| `src`    | `src`     |             | `string` | `undefined` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pod-os:init` |             | `CustomEvent<any>` |


## CSS Custom Properties

| Name              | Description                |
| ----------------- | -------------------------- |
| `--border-radius` | Border radius of the image |
| `--height`        | Height of the image        |
| `--width`         | Width of the image         |


## Dependencies

### Used by

 - [pos-picture](../pos-picture)

### Depends on

- ion-skeleton-text
- ion-icon

### Graph
```mermaid
graph TD;
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  pos-picture --> pos-image
  style pos-image fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
