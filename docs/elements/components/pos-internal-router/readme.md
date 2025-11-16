# pos-internal-router

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description | Type     | Default              |
| -------- | --------- | ----------- | -------- | -------------------- |
| `uri`    | `uri`     |             | `string` | `'pod-os:dashboard'` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- [pos-app-settings](../../apps/pos-app-settings)
- [pos-app-dashboard](../../apps/pos-app-dashboard)

### Graph
```mermaid
graph TD;
  pos-internal-router --> pos-app-settings
  pos-internal-router --> pos-app-dashboard
  pos-app-settings --> pos-setting-offline-cache
  pos-app-dashboard --> pos-getting-started
  pos-app-dashboard --> pos-example-resources
  pos-example-resources --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-app-browser --> pos-internal-router
  style pos-internal-router fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
