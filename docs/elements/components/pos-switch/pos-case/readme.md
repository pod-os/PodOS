
<!-- Auto Generated Below -->


## Overview

Defines a template to use if the specified condition is met - to be used with [pos-switch](https://pod-os.org/reference/elements/components/pos-switch/).
See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.

## Properties

| Property     | Attribute     | Description                                                                   | Type      | Default     |
| ------------ | ------------- | ----------------------------------------------------------------------------- | --------- | ----------- |
| `else`       | `else`        | The test only evaluates to true if tests for preceding cases have failed      | `boolean` | `undefined` |
| `ifProperty` | `if-property` | Test if the resource has the specified property (forward link)                | `string`  | `undefined` |
| `ifRev`      | `if-rev`      | Test if the resource is the subject of the specified property (backward link) | `string`  | `undefined` |
| `ifTypeof`   | `if-typeof`   | Test if the resource is of the specified type                                 | `string`  | `undefined` |
| `not`        | `not`         | Negates the result of the test                                                | `boolean` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
