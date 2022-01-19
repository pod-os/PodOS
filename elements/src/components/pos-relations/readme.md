# pos-relations



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-demo-app](../pos-demo-app)

### Depends on

- ion-item-group
- ion-item-divider
- ion-label
- [pos-rich-link](../pos-rich-link)
- ion-list

### Graph
```mermaid
graph TD;
  pos-relations --> ion-item-group
  pos-relations --> ion-item-divider
  pos-relations --> ion-label
  pos-relations --> pos-rich-link
  pos-relations --> ion-list
  pos-rich-link --> pos-resource
  pos-rich-link --> ion-item
  pos-rich-link --> ion-label
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  pos-demo-app --> pos-relations
  style pos-relations fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
