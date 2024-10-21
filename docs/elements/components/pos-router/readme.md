# pos-router



<!-- Auto Generated Below -->


## Overview

The responsibility of pos-router is to handle the `uri` query param, that specifies the URI of the resource that is currently opened.
It reads this query param and informs other components about changes via the `pod-os:route-changed` event.
It also intercepts the URLs from `pod-os:link` events and pushes them as a new `uri` parameter.

## Properties

| Property | Attribute | Description                                                                                                                                                                       | Type                    | Default        |
| -------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | -------------- |
| `mode`   | `mode`    | The mode defines what default URI will be used, if no URI param is given  - standalone: reroute to pod-os:dashboard - pod: reroute to the URI that is shown in the actual browser | `"pod" \| "standalone"` | `'standalone'` |


## Events

| Event                  | Description                      | Type                  |
| ---------------------- | -------------------------------- | --------------------- |
| `pod-os:route-changed` | Emits the new URI that is active | `CustomEvent<string>` |


## Dependencies

### Used by

 - [pos-app-browser](../../apps/pos-app-browser)

### Graph
```mermaid
graph TD;
  pos-app-browser --> pos-router
  style pos-router fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
