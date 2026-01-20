# pos-if-else

<!-- Auto Generated Below -->


## Overview

Selects a child template to render based on properties of the subject resource, usually defined by an ancestor `pos-resource` element.
See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-if-else) for an example.

Template elements support the following attributes:

- `if-typeof`: Test if the resource is of the specified type
- `not`: Negates the result of the test
- `else`: The test only evaluates to true if tests for preceding templates have failed

## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
