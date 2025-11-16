# pos-app-ldp-container



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [pos-container-contents](../../components/pos-container-contents)
- [pos-subjects](../../components/pos-subjects)
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-ldp-container --> pos-container-contents
  pos-app-ldp-container --> pos-subjects
  pos-app-ldp-container --> pos-label
  pos-app-ldp-container --> pos-type-badges
  pos-app-ldp-container --> pos-literals
  pos-container-contents --> pos-resource
  pos-container-contents --> pos-container-item
  pos-container-contents --> pos-create-new-container-item
  pos-container-contents --> pos-container-toolbar
  pos-subjects --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-add-literal-value --> pos-select-term
  style pos-app-ldp-container fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
