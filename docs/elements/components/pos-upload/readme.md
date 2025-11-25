# pos-upload

<!-- Auto Generated Below -->


## Properties

| Property   | Attribute | Description              | Type                                                                           | Default       |
| ---------- | --------- | ------------------------ | ------------------------------------------------------------------------------ | ------------- |
| `accept`   | --        | The accepted file types. | `string[]`                                                                     | `['image/*']` |
| `uploader` | --        |                          | `(file: File) => ResultAsync<{ url: string; }, HttpProblem \| NetworkProblem>` | `undefined`   |


## Dependencies

### Used by

 - [pos-picture](../pos-picture)

### Graph
```mermaid
graph TD;
  pos-picture --> pos-upload
  style pos-upload fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
