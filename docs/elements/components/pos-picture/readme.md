# pos-picture



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## CSS Custom Properties

| Name              | Description                  |
| ----------------- | ---------------------------- |
| `--border-radius` | Border radius of the picture |
| `--height`        | Height of the picture        |
| `--width`         | Width of the picture         |


## Dependencies

### Used by

 - [pos-app-generic](../../apps/pos-app-generic)
 - [pos-login](../pos-login)

### Depends on

- [pos-image](../pos-image)

### Graph
```mermaid
graph TD;
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  pos-app-generic --> pos-picture
  pos-login --> pos-picture
  style pos-picture fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
