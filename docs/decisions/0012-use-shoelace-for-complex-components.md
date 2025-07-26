# Use Shoelace for Complex Components

## Status

Accepted

## Context and Problem Statement

We are building a web application that emphasizes custom theming and accessibility. Native HTML elements such as `<button>`, `<input>`, and `<dialog>` provide strong accessibility guarantees, consistent behavior, and minimal overhead. For many common UI elements, using native elements styled with our custom theme is preferred.

However, implementing more complex components such as dropdown menus, or toast notifications requires significant effort to get right — especially regarding accessibility and keyboard interaction. Currently, we are redesigning the application header and want to introduce a user menu without too much effort.

## Considered Options

### Shoelace

Shoelace components provide a valuable abstraction with accessible, well-tested behavior out of the box.

### Ionic

Already discarded for reasons described in [0010-get-rid-of-ionic.md](0010-get-rid-of-ionic.md)

### Lion Web Components

Only a small set of components, lacking important ones like a dropdown menu currently needed.

## Decision

Use Shoelace for complex components only. We will not use Shoelace components for simple UI elements like buttons, inputs, or dialogs. These will be implemented using native HTML elements with our own styling and JavaScript where necessary.

We will use Shoelace selectively for complex UI components where:

- Native HTML does not provide an equivalent feature.
- Building the component from scratch would be costly or error-prone.
- Shoelace provides proven accessible behavior that we would otherwise have to reimplement.

Shoelace components will be deliberately cherry-picked from the PodOS elements that need them.

### Examples of acceptable Shoelace components

- `<sl-dropdown>`, `<sl-menu>` for menu/dropdown interactions
- `<sl-tooltip>` where more control is needed than the native `title` attribute provides

### Examples of native elements we will prefer

- `<button>` instead of `<sl-button>`
- `<input>` and `<textarea>` instead of `<sl-input>` and `<sl-textarea>`
- `<dialog>` instead of `<sl-dialog>`, enhanced with styling and focus management if needed

## Consequences

### Positive

- no need to create complex components with keyboard interactions from scratch
- minimal overhead since plain HTML will still be used in most places

### Negative

- must evaluate each case to determine whether native HTML is sufficient
- danger of relying too much on Shoelace where not needed
- effort to have consistent styling between PodOS elements and Shoelace components
- additional overhead through Shoelace dark & light theme CSS