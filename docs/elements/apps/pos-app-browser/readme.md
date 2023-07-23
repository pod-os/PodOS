# pos-app-browser



<!-- Auto Generated Below -->


## Dependencies

### Depends on

- [pos-app](../../components/pos-app)
- [pos-error-toast](../../components/pos-error-toast)
- ion-app
- ion-header
- ion-toolbar
- ion-title
- [pos-login](../../components/pos-login)
- ion-content
- [pos-router](../../components/pos-router)
- ion-footer

### Graph
```mermaid
graph TD;
  pos-app-browser --> pos-app
  pos-app-browser --> pos-error-toast
  pos-app-browser --> ion-app
  pos-app-browser --> ion-header
  pos-app-browser --> ion-toolbar
  pos-app-browser --> ion-title
  pos-app-browser --> pos-login
  pos-app-browser --> ion-content
  pos-app-browser --> pos-router
  pos-app-browser --> ion-footer
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-login --> ion-button
  pos-resource --> ion-progress-bar
  pos-resource --> ion-card
  pos-resource --> ion-card-header
  pos-resource --> ion-card-content
  ion-card --> ion-ripple-effect
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  ion-button --> ion-ripple-effect
  pos-router --> pos-add-new-thing
  pos-router --> pos-navigation-bar
  pos-router --> pos-resource
  pos-router --> pos-type-router
  pos-add-new-thing --> ion-icon
  pos-add-new-thing --> pos-dialog
  pos-add-new-thing --> pos-new-thing-form
  pos-dialog --> ion-icon
  pos-new-thing-form --> pos-select-term
  pos-navigation-bar --> ion-searchbar
  ion-searchbar --> ion-icon
  style pos-app-browser fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
