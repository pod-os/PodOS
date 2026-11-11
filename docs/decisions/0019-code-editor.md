# Use CodeMirror for editing source code

- Status: Accepted
- Deciders: [Angelo Veltens](https://angelo.veltens.org/profile/card#me)
- Date: 2026-11-05

## Context and Problem Statement

PodOS should be able to view and edit source code documents (Markdown source, Turtle/RDF, HTML, JS …) in a plain
text editor with syntax highlighting. Rich-text/WYSIWYG editing of Markdown is already covered
by [ADR-0013](0013-tiptap-markdown-editor.md) (TipTap). Source code editing is a different concern: users need to see
and control the exact content of the file, which TipTap explicitly does not provide ("no direct editing of the source
Markdown").

This ADR applies the same decision drivers as ADR-0013 to the domain of source code editing.

## Decision Drivers

- mobile-friendly UI
- dark mode available / implementable
- UI framework-agnostic / native Web technologies (no React dependency)
- reasonable bundle size, loadable on demand (source editing is a secondary editing mode)
- extensible / stylable within Stencil custom elements using Shadow DOM (see ADR-0001, ADR-0012)
- open for future IDE-like features, e.g. autocompletion in Turtle files, linting, structured navigation
- maintenance status and license suitable for an MIT-licensed OSS project

## Considered Options

- CodeMirror 6
- CodeJar (plus a highlighter like Prism)
- Monaco Editor
- Ace Editor
- plain `<textarea>` plus highlighter

## Decision Outcome

Chosen option: "CodeMirror 6", because it is the only full-featured source editor that officially supports mobile
browsers, is framework-agnostic, modular, MIT-licensed and actively maintained — and because its built-in, modular
extension infrastructure keeps future IDE-like features (autocompletion in Turtle files, linting, structured navigation)
reachable without building editor internals from scratch.

### Positive Consequences

- Mobile editing works out of the box: CodeMirror 6 uses the platform's native selection and editing features on phones.
- Dark mode follows the system color scheme, implemented via the theme API
- Modular bundle: only the needed packages are bundled
- Plain DOM with `cm-` prefixed classes, no framework assumption.
- Actively maintained, MIT licensed.

### Negative Consequences

- PodOS ships ~120 KB of editor code for every source-editing use.
- Theming changes require touching JS (`EditorView.theme()`), not just CSS.
- Syntax highlighting for less common languages adds per-language bundle chunks.

## Pros and Cons of the Options

### CodeMirror 6

The de-facto standard for embedded source editing.

- Good, because it officially targets mobile browsers
- Good, because it is modular (per-package bundles) and framework-agnostic
- Good, because it is actively maintained and MIT licensed
- Good, because it has a rich extension ecosystem (markdown, turtle, search, autocomplete, lint)
- Good, because its extension infrastructure keeps future IDE-like features (e.g. Turtle autocompletion) reachable
  without building editor internals from scratch
- Good, because it works with the PodOS dark-mode approach: follows the system color scheme, verified end-to-end in the
  spike
- Bad, because the theme system is style-injection based, not CSS-variable based
- Bad, because at ~120 KB (basic setup) it is the heaviest viable option except Monaco

### CodeJar (plus Prism)

A tiny (~3 kB) contenteditable-based editor; "bring your own highlighter".

- Good, because it is fully headless and tiny (~3 kB vs ~120 KB)
- Good, because mobile editing works well (contenteditable uses the platform's native touch behavior)
- Good, because Prism has a Turtle grammar out of the box (verified in a spike)
- Good, because the project is actively maintained (npm 5.0.0, Nov 2026)
- Good, because dark mode is straightforward to wire (same matchMedia approach as CodeMirror)
- Bad, because it lacks editor features: no search, no line numbers, no accessibility story, basic undo only
- Bad, because there is no extension API: future IDE features (e.g. Turtle autocompletion) would mean building editor
  internals from scratch

### Monaco Editor

The editor behind VS Code.

- Good, because it brings full IDE features (IntelliSense, multi-cursor, LSP)
- Bad, because mobile browsers are explicitly not supported (official README FAQ says "No.")
- Bad, because it is by far the largest option (~3.9 MB of assets)
- Bad, because it is not meant to be restyled; it injects its own VS Code-derived styles

**Disqualified** by the mobile criterion.

### Ace Editor

The classic embedded editor (used by many older web IDEs).

- Good, because it is embeddable via a single script tag and framework-agnostic
- Good, because it ships 20+ themes including dark ones
- Good, because it is actively maintained
- Bad, because mobile support is not a documented design goal (no mobile/touch mention in the README) and does not feel
  mobile-friendly
- Bad, because the core is monolithic (~128 KB gzipped)

**Disqualified** by the mobile criterion.

### Plain `<textarea>` plus highlighter

- Good, because it has the best possible mobile story (native element)
- Good, because dark mode via CSS variables with Shiki dual themes is trivial
- Good, because zero dependency for editing itself
- Bad, because there is no syntax-highlighted editing without fragile overlay tricks
- Bad, because it lacks indentation handling, search, line numbers and other code-editing basics
- Bad, because PodOS would end up reimplementing a code editor

**Disqualified**: the remaining effort outweighs the benefit; it degenerates into building a code editor.

## Links

- Complements [ADR-0013](0013-tiptap-markdown-editor.md) — TipTap stays in place for rich-text Markdown editing; this
  ADR covers the source-code editing mode.
- [CodeMirror 6](https://codemirror.net/)
- [CodeJar](https://github.com/antonmedv/codejar)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Ace Editor](https://ace.c9.io/)
- [Prism](https://prismjs.com/) (highlighter for the CodeJar option)
