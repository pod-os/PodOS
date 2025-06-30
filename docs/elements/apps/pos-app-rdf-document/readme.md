# pos-app-rdf-document



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [pos-subjects](../../components/pos-subjects)
- [pos-label](../../components/pos-label)
- [pos-type-badges](../../components/pos-type-badges)
- [pos-literals](../../components/pos-literals)

### Graph
```mermaid
graph TD;
  pos-app-rdf-document --> pos-subjects
  pos-app-rdf-document --> pos-label
  pos-app-rdf-document --> pos-type-badges
  pos-app-rdf-document --> pos-literals
  pos-subjects --> pos-rich-link
  pos-rich-link --> pos-resource
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-resource --> ion-progress-bar
  pos-type-badges --> ion-badge
  pos-type-badges --> ion-icon
  pos-literals --> pos-predicate
  pos-literals --> pos-add-literal-value
  pos-predicate --> ion-icon
  pos-add-literal-value --> ion-icon
  pos-add-literal-value --> pos-select-term
  style pos-app-rdf-document fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
