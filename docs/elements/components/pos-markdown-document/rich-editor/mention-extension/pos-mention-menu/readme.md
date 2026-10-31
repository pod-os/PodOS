# pos-mention-menu

<!-- Auto Generated Below -->


## Properties

| Property                | Attribute        | Description                                                                                                          | Type                          | Default     |
| ----------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------- |
| `command`               | --               | Function to call when a suggestion is selected                                                                       | `(item: MentionItem) => void` | `() => {}`  |
| `controls` _(required)_ | --               | Element that announces the active descendant of the listbox, typically the editor that controls it via aria-controls | `HTMLElement`                 | `undefined` |
| `items`                 | --               | List of suggestions to display                                                                                       | `MentionItem[]`               | `[]`        |
| `selectedIndex`         | `selected-index` | Index of the currently selected suggestion                                                                           | `number`                      | `0`         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
