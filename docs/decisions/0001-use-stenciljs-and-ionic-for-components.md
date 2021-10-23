# Use Stencil.js and Ionic for components

## Context and Problem Statement

PodOS should provide a collection of UI components (PodOS elements), that can
easily be integrated into other web apps or html pages. It should be possible to
build simple html dashboards using data from Solid Pods, even without writing
JavaScript. Further the PodOS elements should be easily integrable with any
modern JS framework like React or Vue to build more complex apps.

The components should be based on an existing component library, so that PodOS
does not have to reinvent the wheel to build basic components like buttons, tabs
etc. It should look "nice" by default, so we can focus on the Solid specific
components that build upon that.

## Decision Outcome

To achieve this, web components seem to be a matching choice. StencilJS compiles
directly to webcomponents, without a runtime dependency. Ionic integrates well
with StencilJS and brings a comprehensive component library.

### Positive Consequences

- move fast by using existing Ionic components
- components usable in other apps / websites

### Negative Consequences

- Customizing styles might be hard for apps using PodOS elements
- Moving away from StencilJS / Ionic will probably mean a complete rewrite of
  the component library

## Links

- https://stenciljs.com
- https://ionicframework.com
