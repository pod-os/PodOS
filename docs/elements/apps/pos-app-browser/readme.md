# pos-app-browser



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description                                                                                                                                                                          | Type                    | Default        |
| ------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- | -------------- |
| `mode`                   | `mode`                     | The mode the app is running in:  - standalone: use this when you deploy it as a standalone web application - pod: use this when you host this app as a default interface for you pod | `"pod" \| "standalone"` | `'standalone'` |
| `restorePreviousSession` | `restore-previous-session` |                                                                                                                                                                                      | `boolean`               | `false`        |


## Dependencies

### Depends on

- [pos-app](../../components/pos-app)
- [pos-error-toast](../../components/pos-error-toast)
- [pos-router](../../components/pos-router)
- [pos-add-new-thing](../../components/pos-add-new-thing)
- [pos-navigation](../../components/pos-navigation)
- [pos-login](../../components/pos-login)
- [pos-user-menu](../../components/pos-user-menu)
- [pos-internal-router](../../components/pos-internal-router)
- [pos-resource](../../components/pos-resource)
- [pos-type-router](../../components/pos-type-router)

### Graph
```mermaid
graph TD;
  pos-app-browser --> pos-app
  pos-app-browser --> pos-error-toast
  pos-app-browser --> pos-router
  pos-app-browser --> pos-add-new-thing
  pos-app-browser --> pos-navigation
  pos-app-browser --> pos-login
  pos-app-browser --> pos-user-menu
  pos-app-browser --> pos-internal-router
  pos-app-browser --> pos-resource
  pos-app-browser --> pos-type-router
  pos-error-toast --> ion-toast
  pos-error-toast --> ion-ripple-effect
  ion-toast --> ion-icon
  ion-toast --> ion-ripple-effect
  pos-add-new-thing --> ion-icon
  pos-add-new-thing --> pos-dialog
  pos-add-new-thing --> pos-new-thing-form
  pos-dialog --> ion-icon
  pos-new-thing-form --> pos-select-term
  pos-navigation --> pos-navigation-bar
  pos-navigation --> pos-rich-link
  pos-navigation-bar --> pos-make-findable
  pos-make-findable --> pos-resource
  pos-make-findable --> pos-label
  pos-resource --> ion-progress-bar
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-login --> pos-dialog
  pos-login --> pos-login-form
  pos-login --> pos-resource
  pos-login --> pos-picture
  pos-login --> pos-label
  pos-picture --> pos-image
  pos-image --> ion-skeleton-text
  pos-image --> ion-icon
  pos-user-menu --> pos-resource
  pos-user-menu --> pos-picture
  pos-user-menu --> pos-label
  pos-internal-router --> pos-app-settings
  pos-internal-router --> pos-app-dashboard
  pos-app-settings --> pos-setting-offline-cache
  pos-app-dashboard --> pos-getting-started
  pos-app-dashboard --> pos-example-resources
  pos-example-resources --> pos-rich-link
  style pos-app-browser fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
