# Task 4 — Element smoke test

> **Status:** Done
> **Depends on:** Task 1

## Goal

Verify that existing PodOS elements (`pos-label`, `pos-value`, `pos-list`, etc.) surface metadata for binary resources with zero code changes — confirming that the transparent enrichment from Task 1 is sufficient.

## Scope

- Load a page that renders a binary resource using existing PodOS elements
- Confirm that labels (e.g. `dct:title`), descriptions, and other metadata from the `.meta` document render correctly
- This is a validation step, not an implementation task — if it fails, the gap is in Task 1 or Task 2, not in the elements

## Verification

- Manual or automated: render a binary resource's `Thing` via `pos-label` and `pos-value`, confirm metadata values appear

## Out of Scope

- Any changes to element code
- Write-path testing (covered by Task 3)
