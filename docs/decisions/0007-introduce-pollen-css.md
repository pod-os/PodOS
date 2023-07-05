# Introduce Pollen CSS

## Context and Problem Statement

It should be possible to easily use PodOS elements outside PodOS, e.g. in any HTML page or something like reveal.js slides. Currently, PodOS is build on Ionic components which need to be embedded within a ion-app to work properly. This does not work well with HTML pages that have custom styles and only want to use specific PodOS elements in some places. 

## Considered Options

- Customize Ionic
- Tailwind
- Pollen CSS

## Decision Outcome

Introduce Pollen CSS and style new components with it. Use less and less Ionic components. Existing components might be migrated eventually, but for now it is ok for them to rely on Ionic.

### Positive Consequences

- Pollen CSS fits nicely into the Stencil way of styling via CSS variables
- Using the pre-defined variables a coherent design can be achieved
- More flexibility in creating custom components than with Ionic
- No extra build step in contrast to Tailwind

### Negative Consequences

- style inconsistencies while Ionic and new Pollen based components coexist
- styling is more verbose than with Tailwind classes
- existing elements will still not work outside an ion-app until migrated

## Links

 - [Pollen CSS](https://www.pollen.style)
 - [Ionic](https://ionicframework.com)
 - [Tailwind](https://tailwindcss.com)
