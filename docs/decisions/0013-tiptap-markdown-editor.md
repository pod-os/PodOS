# Introduce TipTap as markdown editor

- Status: Accepted
- Deciders: [Angelo Veltens](https://angelo.veltens.org/profile/card#me)

## Context and Problem Statement

PodOS should be able to render and edit Markdown documents.

Related issues:
- https://github.com/pod-os/PodOS/issues/7
- https://github.com/pod-os/PodOS/issues/63
- https://github.com/pod-os/PodOS/issues/64

## Decision Drivers

- relative links and images with relatives sources should render and work properly
- mobile-friendly UI
- rendered Markdown should be able to show private images behind access protection
- dark mode available / implementable
- extensible with custom elements
- WYSIWYG support
- UI framework-agnostic / native Web technologies
- fit to add collaborative editing in the future

## Considered Options

- Toast UI
- ProseMirror
- TipTap

### Noticed, but not further considered

- Editor.js: no Markdown support (https://github.com/codex-team/editor.js/discussions/1870)
- Plate: React-based only

## Decision Outcome

- Markdown will be edited and rendered using TipTap
- Markdown will be converted to HTML using `marked`
- Edited HTML will be converted back to Markdown using `turndown`

### Positive Consequences

- Full control over UI design and user experience due to headless architecture
- allows implementation of custom node and mark types for specialized content
- Can implement custom solutions for relative links, private images, and dark mode

### Negative Consequences

- Requires building custom UI components from scratch
- Steeper learning curve compared to out-of-the-box solutions like Toast UI
- no direct editing of the source Markdown
- all Markdown has to be converted to HTML and back
  - this may not always be lossless
  - user cannot control the exact Markdown rendering (e.g., using `**` vs `__`)


## Pros and Cons of the Options

### Toast UI

#### Advantages

- good out-of-the-box mobile-ready UI and dark mode
- split view Markdown source / rendered Markdown
- can edit the raw Markdown with full control over the source

#### Disadvantages

- hard to extend with custom node types & functionality

### ProseMirror

#### Advantages

- fully Open Source
- very extensible

#### Disadvantages

- complex to set up
- lacks documentation for more complex setups beyond  `exampleSetup`
- no built-in dark mode or headless rendering

### TipTap

#### Advantages

- headless UI
- very extensible
- extensive documentation
- based on ProseMirror, so everything ProseMirror can do should be possible as well
- Core functionality works out of the box even when run headless:
    - shortcuts for basic formatting (e.g. `CTRL-B` for Bold)
    - inserting links & image URLs
    - undo / redo
    - inline replacement of Markdown syntax (e.g. `##` -> starts a heading)

#### Disadvantages

- the default UI is built on React and not suitable for PodOS
- advanced features are only available commercially
- it works internally with HTML, so Markdown has to be converted back and forth
- custom Nodes and Marks will not allow editable shadow dom contents:
    - https://discuss.prosemirror.net/t/shadow-dom-support/99/9

## Links

- [Toast UI Editor](https://ui.toast.com/tui-editor)
- [ProseMirror](https://prosemirror.net/)
- [TipTap](https://tiptap.dev/)
- [marked](https://marked.js.org)
- [turndown](https://www.npmjs.com/package/turndown)
