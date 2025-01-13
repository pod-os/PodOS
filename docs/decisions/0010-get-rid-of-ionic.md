# Get rid of Ionic

## Context and Problem Statement

Initially, Ionic was chosen as our UI framework as documented in [ADR-0001](0001-use-stenciljs-and-ionic-for-components.md), as it provided a quick start with pre-built components and mobile-first design. However, the negative consequences predicted in that decision (and some more) have materialized:

1. As anticipated in ADR-0001, customizing styles for PodOS elements has proven difficult
2. Ionic's component library only provides basic UI elements, yet requires us to maintain compatibility with its styling system across both iOS and Android platforms for any new components we create
3. Ionic's automatic platform-specific styling (iOS vs Android) conflicts with our goal of allowing users to fully customize the look and feel of PodOS elements
4. Ionic's app structure makes it difficult to embed PodOS elements in simple HTML contexts like dashboards or presentation slides

## Considered Options

- Use plain HTML and CSS for PodOS elements
- Introduce a lightweight CSS library like Pollen
- Stick with Ionic and try to make it work

## Decision Outcome

Chosen option: Use plain HTML and CSS together with Pollen. Ionic will be phased out gradually.

### Positive Consequences

- CSS has become very powerful and easy to use
- Pollen provides a comprehensive set of design tokens and CSS variables similar to Tailwind, giving us a good foundation for consistent styling
- We can use plain html and css for PodOS elements, which makes it easier to embed PodOS elements in simple HTML contexts like dashboards or presentation slides
- We can use the same CSS for both iOS and Android, which simplifies the development process
- Users can override CSS variables to customize the look and feel of PodOS elements

### Negative Consequences

- Ionic has to be removed from all the components
- Reasonable defaults from Ionic have to be implemented manually
- Standard components like buttons, inputs, etc. have to be implemented manually

## Links

- [Pollen](https://pollen.style)
