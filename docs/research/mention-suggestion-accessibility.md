# Research: Accessibility of mention/suggestion menus in rich-text editors

> **Note on conventions:** This file establishes the research-notes convention for
> PodOS (`docs/research/`). There was no prior research-notes directory or
> format; this document is the first of its kind. If later research notes are
> added here, treat this file's structure as the precedent. Research notes are
> findings for project decisions — contributor onboarding and guidance lives in
> `docs/contributing/`.

**Authorship:** This research was gathered by an LLM agent (web fetches of primary
sources, listed below with the URLs actually fetched) on behalf of Angelo. All
conclusions are findings only — no implementation decision has been made.

---

## (a) The question

How do established accessible rich-text editors implement the accessibility of
mention/autocomplete suggestion menus that appear while typing inside a
multi-line rich-text editor (`contenteditable`)?

Context: PodOS uses Tiptap 3 for its markdown editor, with a custom suggestion
popup rendered as the custom element `pos-mention-menu` **outside the editor
DOM** via the Tiptap suggestion plugin's `render()` hooks
(`elements/src/components/pos-markdown-document/rich-editor/mention-extension/render.ts`).
The menu element already carries `role="listbox"` / `role="option"` /
`aria-selected` on its own nodes, but nothing links it back to the editor, so a
screen reader has no way to know the popup belongs to the typing context.

Sub-questions:

1. Does the WAI-ARIA APG define a combobox/autocomplete pattern for multi-line
   rich-text editors?
2. How does ProseMirror handle this?
3. How does Lexical expose mention/typeahead menus to screen readers?
4. How do major Tiptap-based apps handle it?
5. Is there official Tiptap guidance or open issues on suggestion accessibility?
6. What do ARIA 1.2 / ARIA in HTML say about `aria-activedescendant` on
   contenteditable, and about `role="textbox"` `aria-multiline` combined with
   popup semantics?

---

## (b) Findings per source

### 1. WAI-ARIA Authoring Practices Guide — Combobox pattern

Source: <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/> (fetched 2026-10-24)

The APG combobox pattern **does not** cover multi-line rich-text editors. It is
explicitly scoped to single-line editing:

- Keyboard interaction section: "If the combobox is editable, it supports
  standard single line text editing keys appropriate for the device platform".
- The note under that rule says the most robust text editing is supplied by the
  browser for `input[type=text]` and for elements with the `contenteditable`
  HTML attribute — i.e. `contenteditable` is mentioned only as the mechanism
  that supplies *text editing keys*, not as a sanctioned container for combobox
  semantics on a full rich-text editor.

The pattern's normative structure (which any adaptation would have to satisfy):

- "The element that serves as an input and displays the combobox value has role
  `combobox`."
- `aria-controls` on the combobox refers to the popup (only required while the
  popup is visible).
- The popup is `listbox`, `tree`, `grid`, or `dialog`; combobox has an implicit
  `aria-haspopup` of `listbox`.
- `aria-expanded` reflects popup visibility.
- "When a descendant of a listbox, grid, or tree popup is focused, DOM focus
  remains on the combobox and the combobox has `aria-activedescendant` set to a
  value that refers to the focused element within the popup."
- `aria-autocomplete` = `none` | `list` | `both` describes the completion
  behavior.
- Dialog popups do *not* support `aria-activedescendant`; DOM focus moves into
  the dialog instead.

**Conclusion for (1):** No APG pattern exists for autocomplete inside a
multi-line editor. The combobox pattern assumes a single-line value input. The
APG "Editable Combobox with Both List and Inline Autocomplete" example
(<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-both/>,
linked from the pattern page as "Editable Combobox with Both List and Inline
Autocomplete") uses a plain `<input>`, not contenteditable.

### 2. ProseMirror

Sources:

- <https://github.com/ProseMirror/prosemirror/issues?q=aria> (searched via
  GitHub issue search API, queries `repo:ProseMirror/prosemirror aria`,
  `... accessibility`, `... autocomplete aria` — 2026-10-24)
- `prosemirror-view` source, installed copy
  `node_modules/prosemirror-view/dist/index.js` (`computeDocDeco`, lines ~5948–5965)

ProseMirror core has **no autocomplete/combobox accessibility machinery**.
Issue search finds no issue mentioning `aria-activedescendant` in title or body;
the closest hits are unrelated (`#1428` NVDA reading "blank", PR `#84` adding
an `aria-label` option). The forum thread "Enabling accessibility on
prosemirror" (<https://discuss.prosemirror.net/t/enabling-accessibility-on-prosemirror/3147>,
fetched 2026-10-24) records maintainer Marijn Haverbeke's position: "The core
library should be accessible by default. The menu module is pretty terrible, in
terms of keyboard access and screen-reader support, but easy enough to replace."

What ProseMirror *does* do is make the editor DOM itself accessible: it renders
a `contenteditable` element and lets you pass arbitrary extra attributes via
the `attributes` prop (`computeDocDeco` in prosemirror-view merges user-supplied
attributes — everything except `class`, `style`, `contenteditable`,
`nodeName` — into a node decoration on the top-level document node). Tiptap
exposes this as `editorProps.attributes`. So the hook point for adding ARIA to
the editor element exists; ProseMirror itself never sets any `aria-*` or
`role` attribute (grep of the installed `prosemirror-view` dist finds none).

Suggestion/typeahead popups (like ProseMirror's own prosemirror-example-setup
menus or community typeahead plugins) are entirely the application's job; there
is no reference implementation to copy.

**Conclusion for (2):** ProseMirror delegates this completely to integrators.
Nothing in core supports linking a popup to the editor via ARIA.

### 3. Lexical (Meta)

Sources (all fetched 2026-10-24, `main` branch):

- `packages/lexical-react/src/shared/LexicalMenu.tsx`
  <https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/shared/LexicalMenu.tsx>
- `packages/lexical-react/src/LexicalTypeaheadMenuPlugin.tsx`
  <https://github.com/facebook/lexical/blob/main/packages/lexical-react/src/LexicalTypeaheadMenuPlugin.tsx>
- `packages/lexical-a11y/src/index.ts`
  <https://github.com/facebook/lexical/blob/main/packages/lexical-a11y/src/index.ts>

Lexical's typeahead/mention plugin (`LexicalTypeaheadMenuPlugin`) is the closest
published analogue to PodOS's setup: a menu rendered outside the editor DOM,
synchronized with typing. Its ARIA strategy (implemented in the shared
`LexicalMenu` machinery):

1. **The editor root element gets `aria-activedescendant`.** When the
   highlighted menu index changes, `updateSelectedIndex` sets
   `rootElem.setAttribute('aria-activedescendant', 'typeahead-item-' + index)`
   on `editor.getRootElement()` — the contenteditable element itself. It is
   removed in a cleanup effect when the menu closes.
2. **The popup container is a `role="listbox"`.**
   `setContainerDivAttributes` sets `aria-label="Typeahead menu"` and
   `role="listbox"` on the (absolutely positioned, portal-rendered) menu
   container div.
3. **Each item is `role="option"` with `aria-selected`** and a stable id
   (`typeahead-item-${index}`) referenced by `aria-activedescendant`.
4. **The editor root gets `aria-controls="typeahead-menu"`** while the menu is
   open (set in the positioning effect, removed on cleanup) — but note: the
   editor root does **not** get `role="combobox"` or `aria-expanded`.
5. **No live region is used by the typeahead menu itself.** Lexical's
   announcement machinery lives separately in `@lexical/a11y`
   (`AriaLiveRegionExtension`), which mounts a visually hidden
   `role="status" aria-atomic="true"` div — per its own comment, implementing
   the WAI-ARIA *status message* pattern (WCAG 4.1.3) — and is used by other
   extensions (e.g. `AutoLinkAnnounceExtension`,
   `useLexicalAriaLiveRegion`). The typeahead menu does not announce its
   open/closed state through it.

Notably, Lexical does **not** use the full combobox pattern (`role="combobox"`
+ `aria-expanded` + `aria-autocomplete` on the editor). It reuses the single
`aria-activedescendant` mechanism the APG prescribes for combobox popups, but
on a plain contenteditable root without declaring combobox semantics. This is a
pragmatic pattern: it works because `aria-activedescendant` is legal on
`role=textbox` (see finding 6) and because DOM focus genuinely stays in the
contenteditable while the user types and arrows through the menu.

**Conclusion for (3):** Lexical = `aria-activedescendant` on the editor root +
`aria-controls` from editor root to the popup + `role="listbox"` popup with
`role="option"` children + `aria-selected`. No combobox role, no live-region
announcement for the menu itself.

### 4. Tiptap-based apps (Novel)

Source: <https://github.com/steven-tey/novel> (`main` branch, fetched
2026-10-24): `packages/headless/src/components/editor-command.tsx` and
`editor-command-item.tsx`.

Novel's slash-command menu (Tiptap suggestion plugin + cmdk) delegates all ARIA
to the **cmdk** command-palette component
(<https://github.com/pacocoursey/cmdk>, `cmdk/src/index.tsx`, fetched
2026-10-24). cmdk's internal structure is the full APG combobox pattern applied
to a *single-line hidden input*:

```tsx
// cmdk/src/index.tsx — the input element
role="combobox"
aria-autocomplete="list"
aria-expanded={true}
aria-controls={context.listId}
aria-labelledby={context.labelId}
aria-activedescendant={selectedItemId}
// cmdk/src/index.tsx — the list element
role="listbox"
aria-activedescendant={selectedItemId}
```

Novel renders that `<Command>` component *outside* the Tiptap editor DOM (via a
React tunnel/portal) with a **hidden** `Command.Input` bound to the query
(`style={{ display: "none" }}`); the visible typing happens in the Tiptap
contenteditable and is mirrored into the hidden input. It also renders a
mirror element (`#slash-command` node) — in effect synthesizing a combobox
whose input is not the element the user actually types in.

**Conclusion for (4):** A major Tiptap app solves this by *shimming* the APG
combobox pattern: it fabricates a single-line combobox (hidden input + cmdk)
that mirrors editor state, rather than putting combobox semantics on the
contenteditable itself. This keeps the APG pattern intact but relies on a
hidden input mirroring keystrokes — a heavier, app-level workaround. (Other
prominent Tiptap apps were not examined; this one was chosen because its source
is public and it is widely referenced.)

### 5. Tiptap official guidance

Sources:

- <https://tiptap.dev/docs/editor/api/utilities/suggestion>
  (fetched as markdown alternate `.../suggestion.md`, 2026-10-24)
- <https://tiptap.dev/docs/editor/extensions/nodes/mention>
  (fetched as `.../mention.md`, 2026-10-24)
- GitHub issue search `repo:ueberdosis/tiptap` with terms
  `accessibility suggestion`, `mention aria`, `aria-activedescendant`
  (2026-10-24)

The official Suggestion utility docs document the `render()` lifecycle
(`onStart`, `onBeforeStart`, `onUpdate`, `onBeforeUpdate`, `onExit`,
`onKeyDown`), `props.mount()` for positioning the popup, and dismiss-on-escape
behavior — but **contain zero accessibility guidance**: the words "aria",
"accessibility", and "screen reader" do not appear in either doc page. The
`@tiptap/suggestion` package README is a stub pointing to the website.

Issue search found no dedicated accessibility issue for the suggestion utility
(searches with `in:title` constraints returned 0 results; broader hits were
about Details/TaskItem a11y and unrelated things). Tiptap's a11y work to date
focuses on the editor DOM and specific extensions, not on the suggestion popup.

**Conclusion for (5):** No official Tiptap guidance exists for accessible
suggestion popups; integrators are on their own, as with ProseMirror.

### 6. ARIA 1.2 and ARIA in HTML on `aria-activedescendant` / textbox / popup semantics

Sources:

- WAI-ARIA 1.2, <https://www.w3.org/TR/wai-aria-1.2/> (fetched 2026-10-24):
  §5.4 role definitions ("textbox role"), §6.6.7 attribute definitions
  (`aria-activedescendant`, `aria-autocomplete`, `aria-expanded`, `aria-controls`)
- ARIA in HTML, <https://www.w3.org/TR/html-aria/> (fetched 2026-10-24)

Facts established from the normative text:

- **`aria-activedescendant` is allowed on `textbox`** (WAI-ARIA 1.2, §6.6.7
  "Used in Roles" for `aria-activedescendant`: application, combobox, composite,
  group, textbox; and the `textbox` role definition lists
  `aria-activedescendant`, `aria-autocomplete`, `aria-haspopup`,
  `aria-multiline` among its supported states/properties).
- The **`aria-activedescendant`** definition explicitly blesses the
  "controlled element" case: "The element with DOM focus is a combobox, textbox
  or searchbox with `aria-controls` referring to an element that supports
  `aria-activedescendant`, and the value of `aria-activedescendant` refers to an
  owned element of the controlled element." I.e. a `role="textbox"` element may
  carry `aria-controls` pointing at a listbox and `aria-activedescendant`
  pointing at options inside it — precisely the Lexical structure.
- The **`textbox` role** is defined as "A type of input that allows free-form
  text as its value. If the `aria-multiline` attribute is true, the widget
  accepts line breaks within the input, as in an HTML textarea." Its intended
  use includes "cases in which an element with different semantics is
  repurposed as a text field" — i.e. a `contenteditable` div is exactly this
  case.
- **`aria-autocomplete` is supported on `textbox`** (not only combobox), with
  values `inline`, `list`, `both`, `none`. The spec notes authors SHOULD use
  `aria-expanded` to communicate whether the suggestion-collection element is
  displayed when `aria-autocomplete` is `list`/`both` — and `aria-expanded`'s
  "Used in Roles" list for ARIA 1.2 includes `application`, `button`,
  `checkbox`, `combobox`, `gridcell`, `link`, `listbox`, `menuitem`, `row`,
  `rowheader`, `tab`, `treeitem` — **not** `textbox`. So setting
  `aria-expanded` on a `role="textbox"` is outside ARIA 1.2's listed roles
  (this was relaxed in ARIA 1.3 drafts, but ARIA 1.2 is the Recommendation).
- **ARIA in HTML:** `contenteditable` elements have **no implicit role**; their
  allowed roles are "any role" (the `div` row: implicit `role=generic`, "any
  role, though generic SHOULD NOT be used", with naming prohibition for
  `generic`). So `role="textbox"` + `aria-multiline="true"` on the Tiptap
  contenteditable div is conforming ARIA-in-HTML usage. ARIA in HTML also
  forbids `aria-readonly="true"` on elements with `isContentEditable="true"`
  (relevant only if PodOS ever wanted that state).
- Tiptap currently sets **no** role or ARIA attributes on the editor DOM
  (grep of `@tiptap/core` and the underlying ProseMirror attribute plumbing
  shows only `contenteditable` and class/style passthrough), so adding
  `role="textbox" aria-multiline="true"` would be PodOS's own responsibility
  (via Tiptap's `editorProps.attributes`).

---

## (c) Synthesis: viable patterns for PodOS, with trade-offs

Three patterns appear in the wild, all consistent with the normative sources
above. None is prescribed by the APG for multi-line editors; this is an
underspecified area, and the human team must decide. (Findings only — not a
decision.)

### Pattern A — "Lexical pattern": textbox + aria-activedescendant + listbox popup

Concretely for PodOS:

- The Tiptap editor element gets `role="textbox"` and
  `aria-multiline="true"` (settable via Tiptap `editorProps.attributes`).
- The `pos-mention-menu` keeps `role="listbox"` / `role="option"` /
  `aria-selected` (already present) and gains stable option `id`s.
- While the menu is open: the editor element gets `aria-controls` pointing at
  the menu's listbox id, and `aria-activedescendant` pointing at the currently
  highlighted option id (updated by the existing `onKeyDown` /
  `onUpdate` hooks in `render.ts`; cleared on `onExit`).
- Optionally `aria-autocomplete="list"` on the editor element while open.
- Optionally a `role="status"` live region (Lexical `@lexical/a11y`-style)
  announces menu open/close and the highlighted item label.

*Trade-offs:* smallest change to PodOS; DOM focus stays in the editor
(necessary for ongoing typing); explicitly permitted by ARIA 1.2 for
`role=textbox` (see finding 6). Weaker than combobox: ATs will not announce a
"combobox collapsed/expanded" mode, and the menu being *outside* the editor DOM
is fine here because `aria-controls`/`aria-activedescendant` cross DOM
boundaries by ID reference — but the popup element must remain in the same
document and its `role="option"` descendants must be owned/referenced
correctly. Lexical ships exactly this shape in production, so it is field-
tested with major ATs.

### Pattern B — "Novel/cmdk pattern": synthesize a combobox with a hidden input

Mirror the typing into a hidden single-line input carrying
`role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`,
`aria-controls`, `aria-activedescendant`; the popup is that combobox's
`listbox`. The visible contenteditable remains a plain editable region.

*Trade-offs:* conforms fully to the APG combobox pattern, so AT combobox
announcements ("combobox, collapsed/expanded, N results available") come for
free. But it adds a mirrored input element, duplicated query state, and event
synchronization — significant complexity, and screen-reader focus behavior can
diverge because the combobox input is not where the user is actually typing.
This is what Novel does to reuse cmdk, which is a React component; PodOS has no
equivalent need since `pos-mention-menu` is already its own element.

### Pattern C — treat the menu as a dialog: move DOM focus into it

APG's combobox-with-dialog-popup is the one popup variant where DOM focus
leaves the input. A menu variant could take real focus and manage `role="menu"`
/ arrow-key focus internally.

*Trade-offs:* strongest AT semantics but breaks the core UX requirement — the
user must keep typing inside the editor while the menu is open. Focus
extraction interrupts IME/typing continuity. Not observed in any of the
studied editors; listed for completeness. (APG note: dialogs do not support
`aria-activedescendant`.)

### Cross-cutting requirements regardless of pattern

- A `role="listbox"` popup with `role="option"` children, `aria-selected` on
  the active option (PodOS already has these on `pos-mention-menu`).
- `aria-controls` / `aria-activedescendant` require **element IDs**;
  `pos-mention-menu` currently has none (options are rendered without `id`s).
- Clean removal on `onExit` (Lexical removes both attributes in cleanup
  effects).
- The shadow-DOM caveat: `pos-mention-menu` is a custom element; if it renders
  in a shadow root, `getElementById`-style lookups from the light DOM fail and
  `aria-activedescendant`/`aria-controls` ID references must resolve across the
  shadow boundary (ID references are document-scoped per the DOM spec; cross-
  shadow references are not resolved by user agents). Lexical handles a similar
  issue in `useMenuAnchorRef` (shadow-tree tests exist in its repo). Where
  `pos-mention-menu` actually renders relative to the editor document needs
  verification before implementation.

---

## (d) Open questions for the team

1. **Pattern choice (A vs B):** Is the lighter Lexical-style pattern acceptable
   given it forgoes combobox announcements, or does PodOS want full APG
   combobox semantics (which imply the hidden-input mirror of Pattern B)?
   Related: is announcing "N suggestions available" a requirement (needs a
   live region either way)?
2. **Where does `pos-mention-menu` attach?** The suggestion plugin's
   `props.mount()` decides the parent element. Confirm whether it lands in the
   same document as the editor (light DOM) — required for
   `aria-controls`/`aria-activedescendant` ID references to resolve. If the
   element's internals are in shadow DOM, options need IDs in the right scope.
3. **Should the editor element carry `role="textbox" aria-multiline="true"`
   permanently**, or only while a mention query is active? (ARIA 1.2 permits it
   always; Tiptap sets nothing today. Changing the editor element's role affects
   all screen-reader interaction with the editor, not just the menu.)
4. **Testing strategy with real screen readers:** none of the sources proves
   interop. Before committing, a manual test matrix (NVDA+Chrome/Windows,
   VoiceOver+Safari/macOS, Orca+Firefox/Linux) against the chosen pattern
   should be planned. Tiptap/ProseMirror/lexical issue trackers show no
   canonical "this is the verified pattern" evidence either.
5. **Upstream:** Should PodOS file/track a Tiptap issue proposing that the
   suggestion utility document (or ship) an accessible default `render()`?
   Given finding 5 (no official guidance at all), an upstream contribution
   could benefit everyone but is scope beyond this research.
