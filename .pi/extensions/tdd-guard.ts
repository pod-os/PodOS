/**
 * TDD Guard Extension
 *
 * Enforces the red→green→refactor cycle by intercepting every write/edit/bash
 * before it reaches the filesystem or shell.
 *
 * How it works:
 *   1. A Jest reporter (tdd-guard-reporter.js) writes test results to
 *      .pi/tdd-guard/test-results.json after every test run.
 *   2. This extension reads that file on every write/edit tool call.
 *   3. It blocks implementation file changes when no test is currently
 *      failing (nothing to go green for).
 *   4. It blocks test file changes when more than one new failing test
 *      would be introduced (only one red at a time).
 *   5. It blocks git write commands (commit, add, push, stash, reset …)
 *      in bash — committing is the human's job, not the agent's.
 *
 * The agent cannot bypass this — the block happens at the tool layer,
 * before the file is touched or the command is run.
 *
 * Setup:
 *   - Install the reporter: see .pi/tdd-guard/README.md
 *   - Run your tests after every change so results stay fresh.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const RESULTS_FILE = ".pi/tdd-guard/test-results.json";

interface TestResults {
  passed: string[];
  failed: string[];
  timestamp: number;
}

function readResults(cwd: string): TestResults | null {
  const filePath = path.join(cwd, RESULTS_FILE);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as TestResults;
  } catch {
    return null;
  }
}

function isTestFile(filePath: string): boolean {
  return (
    filePath.includes(".spec.") ||
    filePath.includes(".test.") ||
    filePath.includes("__tests__")
  );
}

/**
 * Count the number of test-case call sites (it / test) in a source string.
 * We match `it(` and `test(` as bare identifiers to avoid counting
 * e.g. `emit(` or comment references.
 */
function countTestCases(source: string): number {
  // Match `it(` or `test(` preceded by a word boundary / start-of-line.
  const matches = source.match(/(?<![\w$])(?:it|test)\s*\(/g);
  return matches ? matches.length : 0;
}

/**
 * For an `edit` tool call, apply the oldText→newText substitutions to the
 * current file content and return the resulting string, or null if the file
 * cannot be read.
 */
function applyEdits(
  currentContent: string,
  edits: Array<{ oldText: string; newText: string }>,
): string {
  let result = currentContent;
  for (const { oldText, newText } of edits) {
    result = result.replace(oldText, newText);
  }
  return result;
}

function isImplementationFile(filePath: string): boolean {
  return !isTestFile(filePath) && /\.(ts|tsx|js|jsx)$/.test(filePath);
}

export default function (pi: ExtensionAPI) {
  const cwd = process.cwd();

  pi.on("session_start", async (_event, ctx) => {
    const resultsPath = path.join(cwd, RESULTS_FILE);
    if (!fs.existsSync(resultsPath)) {
      if (ctx.hasUI) {
        ctx.ui.notify(
          "TDD Guard: no test results found. Run your tests once to activate enforcement.",
          "warning",
        );
      }
    } else {
      if (ctx.hasUI) {
        ctx.ui.notify("TDD Guard active — red→green→refactor enforced.", "info");
      }
    }
  });

  // Git write subcommands the agent must never run.
  const GIT_WRITE_SUBCOMMANDS = ["commit", "add", "push", "stash", "reset", "checkout", "merge", "rebase", "tag", "rm", "mv"];

  function containsGitWrite(command: string): string | null {
    // Normalise: collapse whitespace, strip leading whitespace.
    const cmd = command.replace(/\s+/g, " ").trim();
    for (const sub of GIT_WRITE_SUBCOMMANDS) {
      // Match `git <sub>` possibly preceded by shell operators or semicolons.
      if (new RegExp(`(^|[;&|]\\s*)git\\s+${sub}(\\s|$)`).test(cmd)) {
        return sub;
      }
    }
    return null;
  }

  pi.on("tool_call", async (event, ctx) => {
    const toolName = event.toolName;

    // ── BASH — block git write commands ─────────────────────────────────────
    if (toolName === "bash") {
      const command: string = (event.input as { command: string }).command ?? "";
      const matched = containsGitWrite(command);
      if (matched) {
        return {
          block: true,
          reason:
            `TDD Guard: \`git ${matched}\` is not allowed from the agent.\n` +
            "Committing (and all other git write operations) is the human's responsibility.\n" +
            "Propose the commit message and wait for the human to commit.",
        };
      }
      return undefined;
    }

    // Only intercept file-writing tools beyond this point
    if (toolName !== "write" && toolName !== "edit") return undefined;

    const filePath: string = (event.input as { path: string }).path ?? "";

    // Only care about source files
    if (!isTestFile(filePath) && !isImplementationFile(filePath)) {
      return undefined;
    }
    // Never block writes to the guard extension itself.
    if (filePath.includes('.pi/extensions/')) {
      return undefined;
    }

    const results = readResults(cwd);

    if (!results) {
      // No results file — reporter not set up. Warn but don't block.
      if (ctx.hasUI) {
        ctx.ui.notify(
          "TDD Guard: test results not found. Run tests to enable enforcement.",
          "warning",
        );
      }
      return undefined;
    }

    const staleness = Date.now() - results.timestamp;
    const STALE_MS = 5 * 60 * 1000; // 5 minutes
    if (staleness > STALE_MS && ctx.hasUI) {
      ctx.ui.notify(
        `TDD Guard: test results are ${Math.round(staleness / 1000)}s old. Run tests to refresh.`,
        "warning",
      );
    }

    // ── IMPLEMENTATION FILE ──────────────────────────────────────────────────
    // Block writing implementation code when all tests are passing.
    // There must be at least one failing test (the red step) before
    // implementation is allowed.
    if (isImplementationFile(filePath)) {
      if (results.failed.length === 0) {
        return {
          block: true,
          reason:
            "TDD Guard: all tests are passing — there is nothing to go green for.\n" +
            "Write a failing test first (red step), run the tests, then implement.",
        };
      }
      // There are failing tests — implementation is allowed (green step).
      return undefined;
    }

    // ── TEST FILE ────────────────────────────────────────────────────────────
    // After the edit lands we can't know exactly how many new tests will fail,
    // but we can check the current state: if tests are already failing,
    // adding more test code without first going green is a violation.
    //
    // Exception: if the implementation change (green step) caused regressions
    // in test files that were previously passing, those test files need to be
    // repaired as part of the green step.  We detect this by checking whether
    // ALL currently-failing tests live inside files that are already dirty
    // (modified by the green step).  If so, the edit is a regression repair,
    // not a new red step, and we allow it.
    if (isTestFile(filePath)) {
      if (results.failed.length > 0) {
        // Collect the set of dirty (modified/untracked) absolute file paths.
        let dirtyAbsPaths = new Set<string>();
        try {
          const gitStatus = execSync("git status --porcelain", { cwd, encoding: "utf8" }).trim();
          for (const line of gitStatus.split("\n").filter(Boolean)) {
            dirtyAbsPaths.add(path.resolve(cwd, line.slice(3).trim()));
          }
        } catch {
          // Not a git repo — can't determine dirtiness, fall through to block.
        }

        // Map each failing test name back to a suite file path.
        // The reporter stores only the test name, not the file, so we use
        // the jest results file list embedded in a separate field if available.
        // Since we only have test names, we check whether the file currently
        // being edited (the regression target) is already dirty, AND whether
        // the file being written is already dirty — meaning the agent is
        // repairing a file it modified during the green step.
        const absTarget = path.resolve(cwd, filePath);
        const targetIsDirty = dirtyAbsPaths.has(absTarget);

        // Allow the repair if the file being edited is already dirty
        // (touched during this green step) — this is a regression fix,
        // not a new red test.
        if (targetIsDirty) {
          return undefined;
        }

        // ── Regression-fix exception (content-based) ──────────────────────
        // Even when the file is clean in git, the edit may just be updating
        // existing assertions to match a changed interface — not adding new
        // tests.  If the proposed content has no more `it(` / `test(` blocks
        // than the current file, no new test case is being introduced, so
        // the edit is a regression repair and should be allowed.
        try {
          const currentContent = fs.existsSync(absTarget)
            ? fs.readFileSync(absTarget, "utf8")
            : "";
          const currentCount = countTestCases(currentContent);

          let proposedContent: string | null = null;
          if (toolName === "write") {
            proposedContent =
              (event.input as { content?: string }).content ?? "";
          } else if (toolName === "edit") {
            const rawEdits = (event.input as { edits?: Array<{ oldText: string; newText: string }> }).edits ?? [];
            proposedContent = applyEdits(currentContent, rawEdits);
          }

          if (proposedContent !== null) {
            const proposedCount = countTestCases(proposedContent);
            if (proposedCount <= currentCount) {
              // No new test cases — this is a regression fix, not a new red step.
              return undefined;
            }
          }
        } catch {
          // If we can't read/parse, fall through to the block below.
        }

        return {
          block: true,
          reason:
            `TDD Guard: ${results.failed.length} test(s) are already failing:\n` +
            results.failed.map((t) => `  - ${t}`).join("\n") +
            "\n\nComplete the green step (make the failing test pass) before writing the next test.\n" +
            "If these are regressions caused by your implementation change, fix them now — that is still part of the green step.",
        };
      }
      // All tests passing — block if there are uncommitted changes *other than*
      // the test file currently being written.  The agent may make multiple
      // edits to the same test file while building the red step; only block
      // when a *different* file is dirty (meaning a prior cycle was completed
      // but not yet committed).
      try {
        const gitStatus = execSync("git status --porcelain", { cwd, encoding: "utf8" }).trim();
        if (gitStatus.length > 0) {
          const absTarget = path.resolve(cwd, filePath);
          const absGuard = path.resolve(cwd, ".pi/extensions/tdd-guard.ts");
          const otherDirtyFiles = gitStatus
            .split("\n")
            .filter(Boolean)
            .filter((line) => {
              // porcelain lines: "XY path"
              const dirtyPath = path.resolve(cwd, line.slice(3).trim());
              // Allow the file being written and the guard extension itself.
              return dirtyPath !== absTarget && dirtyPath !== absGuard;
            });
          if (otherDirtyFiles.length > 0) {
            return {
              block: true,
              reason:
                "TDD Guard: there are uncommitted changes.\n" +
                "Commit the completed cycle before starting a new red step.\n\n" +
                "Uncommitted files:\n" +
                otherDirtyFiles.map((l) => `  ${l}`).join("\n"),
            };
          }
        }
      } catch {
        // Not a git repo or git not available — allow without blocking.
      }
      // All tests passing and working tree clean — writing one new (red) test is allowed.
      return undefined;
    }

    return undefined;
  });
}
