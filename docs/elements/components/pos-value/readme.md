# pos-value



<!-- Auto Generated Below -->


## Overview

Shows a single value linked to the resource using the given predicate.
The value is determined by [Thing.observeAnyValue()](https://pod-os.org/reference/core/classes/thing/#observeanyvalue)
and re-renders when data in the store changes

## Properties

| Property    | Attribute   | Description                                | Type     | Default     |
| ----------- | ----------- | ------------------------------------------ | -------- | ----------- |
| `predicate` | `predicate` | URI of the predicate to get the value from | `string` | `undefined` |


## Events

| Event             | Description | Type               |
| ----------------- | ----------- | ------------------ |
| `pod-os:resource` |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
