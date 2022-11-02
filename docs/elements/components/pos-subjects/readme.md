# pos-subjects



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-app-generic](../../apps/pos-app-generic)

### Depends on

- [pos-rich-link](../pos-rich-link)
- ion-list

### Graph
```mermaid
graph TD;
  pos-subjects --> pos-rich-link
  pos-subjects --> ion-list
  pos-rich-link --> pos-resource
  pos-rich-link --> ion-item
  pos-rich-link --> ion-label
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
  pos-app-generic --> pos-subjects
  style pos-subjects fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
