# pos-rich-link



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                               | Type     | Default     |
| -------- | --------- | ----------------------------------------------------------------------------------------- | -------- | ----------- |
| `rel`    | `rel`     | Link will be obtained by following the predicate with this URI forward from a resource    | `string` | `undefined` |
| `rev`    | `rev`     | Link will be obtained by following the predicate with this URI in reverse from a resource | `string` | `undefined` |
| `uri`    | `uri`     | Link will use this URI                                                                    | `string` | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:error`    |             | `CustomEvent<any>` |
| `pod-os:link`     |             | `CustomEvent<any>` |
| `pod-os:resource` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [pos-example-resources](../../apps/pos-app-dashboard/pos-example-resources)
 - [pos-navigation](../pos-navigation)
 - [pos-relations](../pos-relations)
 - [pos-reverse-relations](../pos-reverse-relations)
 - [pos-subjects](../pos-subjects)

### Depends on

- [pos-label](../pos-label)
- [pos-description](../pos-description)
- [pos-resource](../pos-resource)

### Graph
```mermaid
graph TD;
  pos-rich-link --> pos-label
  pos-rich-link --> pos-description
  pos-rich-link --> pos-resource
  pos-resource --> ion-progress-bar
  pos-example-resources --> pos-rich-link
  pos-navigation --> pos-rich-link
  pos-relations --> pos-rich-link
  pos-reverse-relations --> pos-rich-link
  pos-subjects --> pos-rich-link
  style pos-rich-link fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
