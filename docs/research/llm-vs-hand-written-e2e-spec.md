# LLM-Extruded vs. Hand-Written: The Same E2E Test, Written Twice

The same E2E spec, written twice: once by an LLM agent (branch [`e2e-source-editor-saving`](https://github.com/pod-os/PodOS/tree/e2e-source-editor-saving), tip [`f307ef65`](https://github.com/pod-os/PodOS/commit/f307ef656b238d228c7b13e3f4246993caf4280b)), once by hand ([`5b9cf03d`](https://github.com/pod-os/PodOS/commit/5b9cf03d0ecdb37253de294933d8c1aef66dedb0) on `main`).

## Why This Experiment Ran

The question: can an LLM agent write an E2E test at the quality Angelo would produce himself? To find out, the same task was run twice, independently:

1. **Agent pass (branch `e2e-source-editor-saving`):** an LLM agent wrote the test on its own, without review or guidance beyond the plan.
2. **Hand-written pass (main):** Angelo implemented his own version, deliberately not looking at the agent's output first.

What struck Angelo beyond the test quality itself: the agent's output was shaped far more by the existing codebase and its conventions than by the model's training data. It replicated the repo's patterns (page objects, BDD steps, fixture style) so faithfully that the result is very close to what a developer would have written by hand — only in a fraction of the time.

## What Came Out of It

Both versions test the same flow and both pass it. The agent's version holds up in quality and was much faster to produce. Where the hand-written version differs, it's mostly taste rather than one being right — it checks a few more intermediate states, and it reuses the existing `ToolSelect` page object instead of building a custom `open()`.

- **Where the agent did the better job:** behavior-level page-object API, content assertions that only check the changed text, a more realistic fixture.
- **Where the agent genuinely fell short:** the commit workflow — a spec commit that predates the fixture it depends on, everything split into commits after the fact, and a mutated fixture committed unnoticed.

**The bigger takeaway:** a qualitatively sufficient — in places better — test in a fraction of the time. What mattered was not the model's training data, but the existing codebase and conventions the agent could draw on: the outcome closely resembles what the same developer would have written by hand, only much faster.

## 1. How the Two Versions Differ

### 1.1 Scenario Structure

```text
Main (by hand):                Branch (agent):
Given PodOS open               Given PodOS open
And signed in                  And signed in
When navigate to TTL doc       When navigate to TTL doc
And open Src tool              And document is shown in source editor
Then initial content shown     And editing the content
When user edits                And saving the changes
Then pending changes           Then change persists after reload
And contains new text
When user saves
Then all saved
And persists after reload
```

### 1.2 Detailed Differences

In the last column, **agent (branch)** / **hand-written (main)** names the version that handles the aspect better; **tie** means neither stands out.

| Aspect | Main (hand-written) | Branch (agent) | Better |
| --- | --- | --- | --- |
| Fixture / resource | `alice/source-editor/document.ttl` — anonymous document with properties on itself (`<>`). | `alice/turtle-document/document` — named `schema:Thing`, closer to real pod usage. | **agent (branch)** |
| Opening the tool | `toolSelect.openSrcTool()` — reuses the existing, idiomatic `ToolSelect` page object. | Own `open()` method on the tool; drops the `ToolSelect` integration. | **hand-written (main)** |
| Status checks | Spec asserts concrete UI text: `toContainText("pending changes")`. | `expectUnsavedChanges()` / `expectAllSaved()` — steps express intent, UI details stay in the page object. | **agent (branch)** |
| Content assertions | Full serialized Turtle string (whitespace-collapsed) — brittle against any formatting change. | Only the actually changed fragment — tests what changed, tolerant to serialization. | **agent (branch)** |
| Assertion density | After edit: status **and** new content. After reload: content **and** "all saved". | After edit: status only. After reload: content only. | **hand-written (main)** |
| Replacing content | `clear()` + `pressSequentially()` | `click()` + `ControlOrMeta+a` + `pressSequentially()` | tie |
| After reload | Directly asserts editor and status. | Extra `sourceEditor.open()` after `page.reload()` — redundant if the reload retains the tool. | **hand-written (main)** |

## 2. Test Quality

| Criterion | Main (hand-written) | Branch (agent) | Better |
| --- | --- | --- | --- |
| Abstraction level | Steps leak UI details (status text, full content). | Steps stay behavioral — where E2E tests remain maintainable. | **agent (branch)** |
| Assertion focus | Full serialization comparison — overchecks beyond what the test claims. | Only the changed fragment — tests what actually changed. | **agent (branch)** |
| Transition coverage | Every state change verified (init → pending+text → saved → reload+saved). | Status transitions + persistence; the "new text visible" intermediate is missing. | **hand-written (main)** |
| Reuse of existing infrastructure | Reuses `ToolSelect`. | Own `open()` method; integration removed. | **hand-written (main)** |
| Minimalism | No redundant steps. | Redundant `open()` after reload. | **hand-written (main)** |

**The assessment in hindsight:** the agent's approach is the better one in a few places — the behavior-level page object and the focused content assertions. The hand-written denser assertions are nice to have — a bit over-specific, but strictly speaking more precise, and the content is there either way, so it's not a real problem. On `ToolSelect` vs. a custom `open()`, Angelo leans toward reusing the existing page object — but that's taste, not a verdict. Both versions are perfectly fine.

## 3. Commits — Where the Agent Fell Short the Most

### Main (by hand): 2 commits

- `ad1f6874` — spec, page object, ToolSelect integration, fixture together.
- `5b9cf03d` — edit/save part added.

Consistent as a whole, no broken intermediate states. Minor: a typo in the subject, no rationale in the body.

### Branch (agent): 6 test-relevant commits

- `f57dd545` 19:52:30 — page object
- `e2a8aef3` 19:52:35 — spec (references the `turtle-document` fixture …)
- `64d32f2a` 19:52:44 — … which only exists in *this* commit
- `0d44ff64` 21:25 — fixture initial state rescued
- `6ca33f1d`, `f307ef65` — refinements, plan closure

### 3.1 What went wrong: commits that don't stand on their own

The order is page object → spec → **fixture**, all within 14 seconds. The spec commit (`e2a8aef3`) references `alice/turtle-document/document` — a fixture that only exists in the *next* commit. The spec commit does not run.

This shows how the work was actually done: not stepwise (build page object → test → commit), but everything finished in one pass and afterwards split into commits that are meaningless in isolation. The commit boundaries are cosmetic, not substantive.

### 3.2 What also went wrong: the mutated fixture

The fixture was committed after the test had already mutated it via PUT — the agent did not notice, so the persistence assertion would have passed even with a broken save. `0d44ff64` restored the initial state afterwards.

To be fair: the root cause is a gap in the existing test design — fixtures get mutated and are never cleaned up, which also affects other specs. *Still*, the agent should have noticed before committing and not needed a rescue commit afterwards.

### 3.3 Both sides of the agent's commits

| What went wrong | What worked well |
| --- | --- |
| Spec commit without its fixture — does not run | Conventional commit format throughout |
| 14-second intervals → evidence of post-hoc splitting, not stepwise work | LLM provenance transparently declared (`[llm-extruded]`, `llm:`/`prompt:` trailers) |
| Mutated fixture committed, rescued later | The later fix (`0d44ff64`) honestly documents its cause |
| Commit messages imply stepwise work ("add …", "edit and save …") that did not happen | |

## 4. Takeaways

The agent keeps up with the hand-written implementation in test design — in a few places it does the better job (page-object API, focused content assertions, realistic fixture). Where it genuinely fell short is process: commit workflow discipline. The hand-written version is more thorough in its assertions, but that's a different emphasis, not a mistake. Nothing gets merged; the branch stays as-is as a documented benchmark.

The bigger picture: LLM agents can produce qualitatively sufficient — in places better — tests in very little time. The decisive factor is not the model's training data but the surrounding context: the existing code, page objects, conventions and test patterns the agent picks up and recombines. That's why its output converges with the hand-written version rather than diverging. The implication for practice: investing in clear conventions and discoverable existing code pays off directly in agent output quality. Reviewing the agent's output remains part of the job — and beyond that, the focus is on improving the process itself, so that the agent gets things like commits and fixture handling right on its own next time.

---

*Basis: `git diff main e2e-source-editor-saving` on `apps/tests/` and `apps/test-solid-server/data/alice/`, commit history of both states (branch tip [`f307ef65`](https://github.com/pod-os/PodOS/commit/f307ef656b238d228c7b13e3f4246993caf4280b), main tip [`5b9cf03d`](https://github.com/pod-os/PodOS/commit/5b9cf03d0ecdb37253de294933d8c1aef66dedb0)). Assessment of the helper methods, the Ctrl+A point, the ToolSelect preference and the commit critique is Angelo's judgment; the reload-retains-tool behavior is included as an unverified user observation. Infra and debug side findings were deliberately excluded.*
