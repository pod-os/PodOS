# pos-case

<!-- Auto Generated Below -->


## Overview

Defines a template to use if the specified condition is met - to be used with [pos-switch](https://pod-os.org/reference/elements/components/pos-switch/).
See [storybook](https://pod-os.github.io/PodOS/storybook/?path=/story/basics--pos-switch) for an example.

## Properties

| Property        | Attribute         | Description                                                                                                                                         | Type      | Default     |
| --------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `active`        | `active`          | Whether this case is active, i.e. shown. Usually this is controlled by the surrounding pos-switch, and there is no need to set this manually.       | `boolean` | `false`     |
| `else`          | `else`            | The test only evaluates to true if tests for preceding cases have failed                                                                            | `boolean` | `undefined` |
| `everyValueEq`  | `every-value-eq`  | Test if every value linked by if-property or if-rev is equal to the attribute                                                                       | `string`  | `undefined` |
| `everyValueGt`  | `every-value-gt`  | Test if every value linked by if-property or if-rev is strictly greater than the attribute. First a number comparison is attempted, then string.    | `string`  | `undefined` |
| `everyValueGte` | `every-value-gte` | Test if every value linked by if-property or if-rev is greater than or equal to the attribute. First a number comparison is attempted, then string. | `string`  | `undefined` |
| `everyValueLt`  | `every-value-lt`  | Test if every value linked by if-property or if-rev is strictly less than the attribute. First a number comparison is attempted, then string.       | `string`  | `undefined` |
| `everyValueLte` | `every-value-lte` | Test if every value linked by if-property or if-rev is less than or equal to the attribute. First a number comparison is attempted, then string.    | `string`  | `undefined` |
| `ifProperty`    | `if-property`     | Test if the resource has the specified property (forward link)                                                                                      | `string`  | `undefined` |
| `ifRev`         | `if-rev`          | Test if the resource is the subject of the specified property (backward link)                                                                       | `string`  | `undefined` |
| `ifTypeof`      | `if-typeof`       | Test if the resource is of the specified type                                                                                                       | `string`  | `undefined` |
| `not`           | `not`             | Negates the result of the test                                                                                                                      | `boolean` | `undefined` |
| `someValueEq`   | `some-value-eq`   | Test if some value linked by if-property or if-rev is equal to the attribute                                                                        | `string`  | `undefined` |
| `someValueGt`   | `some-value-gt`   | Test if some value linked by if-property or if-rev is strictly greater than the attribute. First a number comparison is attempted, then string.     | `string`  | `undefined` |
| `someValueGte`  | `some-value-gte`  | Test if some value linked by if-property or if-rev is greater than or equal to the attribute. First a number comparison is attempted, then string.  | `string`  | `undefined` |
| `someValueLt`   | `some-value-lt`   | Test if some value linked by if-property or if-rev is strictly less than the attribute. First a number comparison is attempted, then string.        | `string`  | `undefined` |
| `someValueLte`  | `some-value-lte`  | Test if some value linked by if-property or if-rev is less than or equal to the attribute. First a number comparison is attempted, then string.     | `string`  | `undefined` |


## Methods

### `getRule() => Promise<SwitchCaseRule>`

Returns the rule definition for this case. The rule determines if the element's content gets rendered.

#### Returns

Type: `Promise<SwitchCaseRule>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
