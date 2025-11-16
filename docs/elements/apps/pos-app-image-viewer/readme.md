# pos-app-image-viewer



<!-- Auto Generated Below -->


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Depends on

- [pos-image](../../components/pos-image)
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-image-viewer --> pos-image
  pos-app-image-viewer --> pos-label
  pos-app-image-viewer --> pos-type-badges
  pos-app-image-viewer --> pos-literals
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-add-literal-value --> pos-select-term
  style pos-app-image-viewer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
