# pos-app



<!-- Auto Generated Below -->


## Properties

| Property                 | Attribute                  | Description | Type      | Default |
| ------------------------ | -------------------------- | ----------- | --------- | ------- |
| `restorePreviousSession` | `restore-previous-session` |             | `boolean` | `false` |


## Events

| Event                     | Description                             | Type                            |
| ------------------------- | --------------------------------------- | ------------------------------- |
| `pod-os:session-restored` | Fired whenever the session was restored | `CustomEvent<{ url: string; }>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Depends on

- ion-progress-bar

### Graph
```mermaid
graph TD;
  pos-app --> ion-progress-bar
  pos-app-browser --> pos-app
  style pos-app fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
