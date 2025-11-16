# pos-app-generic



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [pos-picture](../../components/pos-picture)
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-description](../../components/pos-description)
- [pos-literals](../../components/pos-literals)
- [pos-relations](../../components/pos-relations)
- [pos-reverse-relations](../../components/pos-reverse-relations)

### Graph
```mermaid
graph TD;
  pos-app-generic --> pos-picture
  pos-app-generic --> pos-label
  pos-app-generic --> pos-type-badges
  pos-app-generic --> pos-description
  pos-app-generic --> pos-literals
  pos-app-generic --> pos-relations
  pos-app-generic --> pos-reverse-relations
  pos-picture --> pos-image
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-add-literal-value --> pos-select-term
  pos-relations --> pos-predicate
  pos-relations --> pos-rich-link
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-reverse-relations --> pos-predicate
  pos-reverse-relations --> pos-rich-link
  style pos-app-generic fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
