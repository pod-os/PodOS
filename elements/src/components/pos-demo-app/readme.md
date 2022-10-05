# pos-demo-app



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [pos-app](../pos-app)
- ion-header
- ion-toolbar
- ion-title
- [pos-login](../pos-login)
- ion-content
- [pos-router](../pos-router)
- ion-footer

### Graph
```mermaid
graph TD;
  pos-demo-app --> pos-app
  pos-demo-app --> ion-header
  pos-demo-app --> ion-toolbar
  pos-demo-app --> ion-title
  pos-demo-app --> pos-login
  pos-demo-app --> ion-content
  pos-demo-app --> pos-router
  pos-demo-app --> ion-footer
  pos-app --> ion-app
  pos-login --> pos-resource
  pos-login --> pos-label
  pos-login --> ion-button
  pos-resource --> ion-progress-bar
  ion-button --> ion-ripple-effect
  pos-router --> pos-resource
  pos-router --> pos-app-generic
  pos-app-generic --> ion-grid
  pos-app-generic --> ion-row
  pos-app-generic --> ion-col
  pos-app-generic --> ion-card
  pos-app-generic --> ion-card-header
  pos-app-generic --> pos-image
  pos-app-generic --> ion-card-title
  pos-app-generic --> pos-label
  pos-app-generic --> ion-card-content
  pos-app-generic --> pos-description
  pos-app-generic --> pos-literals
  pos-app-generic --> pos-relations
  pos-app-generic --> pos-reverse-relations
  ion-card --> ion-ripple-effect
  pos-image --> ion-skeleton-text
  pos-literals --> ion-item-group
  pos-literals --> ion-item-divider
  pos-literals --> ion-label
  pos-literals --> ion-item
  pos-literals --> ion-list
  ion-item --> ion-icon
  ion-item --> ion-ripple-effect
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
  pos-reverse-relations --> ion-item-group
  pos-reverse-relations --> ion-item-divider
  pos-reverse-relations --> ion-label
  pos-reverse-relations --> pos-rich-link
  pos-reverse-relations --> ion-list
  style pos-demo-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
