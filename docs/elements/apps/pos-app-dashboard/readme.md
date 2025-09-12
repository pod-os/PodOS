# pos-app-dashboard

<!-- Auto Generated Below -->


## Dependencies

### Used by

 - [pos-internal-router](../../components/pos-internal-router)

### Depends on

- [pos-getting-started](pos-getting-started)
- [pos-example-resources](pos-example-resources)

### Graph
```mermaid
graph TD;
  pos-app-dashboard --> pos-getting-started
  pos-app-dashboard --> pos-example-resources
  pos-example-resources --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-resource --> ion-progress-bar
  pos-internal-router --> pos-app-dashboard
  style pos-app-dashboard fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
