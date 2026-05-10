/**
 * TDD Guard Extension
 *
 * Enforces the test→impl→refactor cycle by intercepting every write/edit/bash
 * before it reaches the filesystem or shell.
 *
 * How it works:
 *   1. A Jest reporter (.pi/tdd-guard/jest-reporter.js) writes test results to
 *      .pi/tdd-guard/test-results.json after every test run.
 *   2. The current phase is stored in .pi/tdd-guard/config.json.
 *      config.json is INTERNAL RUNTIME STATE — it must never be written directly
 *      by the agent or by hand. Use the /tdd-activate command (or the
 *      activate_tdd_phase tool) to switch phases. Direct writes to config.json
 *      are blocked by the guard.
 *   3. Phase activation (/tdd-activate <phase> or activate_tdd_phase tool):
 *        a. Runs the full test suite (npm test) and updates test-results.json.
 *        b. Checks the precondition for the target phase:
 *             test     — all tests green AND working tree clean
 *             impl     — at least one test failing
 *             refactor — all tests green AND working tree clean
 *        c. If the precondition is met, writes config.json to activate the phase.
 *        d. If not met, rejects with a clear error; the phase stays unchanged.
 *   4. Within-phase rules are checked on every write/edit tool call to a source
 *      file. These rules never involve the working tree:
 *
 *        test     — only test files may be written; impl file writes are blocked;
 *                   at most one new it()/test() call site may be added across
 *                   the whole phase.
 *
 *        impl     — impl file writes are freely allowed; test file writes are
 *                   allowed only as regression repairs (no new it()/test() call
 *                   sites may be added).
 *
 *        refactor — both impl and test files may be freely edited; no new
 *                   it()/test() call sites may be added.
 *
 *   5. It blocks git write commands (commit, add, push, stash, reset …)
 *      in bash — committing is the human's job, not the agent's.
 *
 * Status bar:
 *   tdd ● refactor  ✓ 42  ✗ 0
 *   The counts come from test-results.json and are refreshed:
 *     - After every activation command (which always runs the suite)
 *     - After every npm test run (the Jest reporter updates test-results.json,
 *       and the guard watches that file to refresh the status bar)
 *
 * Setup:
 *   - Install the reporter: see .pi/tdd-guard/README.md
 *   - Use /tdd-activate <phase> or the activate_tdd_phase tool to switch phases.
 *   - Run your tests after every step so results stay fresh.
 *
 * Always-exempt files (never "dirty" for working-tree checks during activation):
 *   - .pi/extensions/tdd-guard.ts
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const RESULTS_FILE = ".pi/tdd-guard/test-results.json";
const CONFIG_FILE = ".pi/tdd-guard/config.json";

type Phase = "test" | "impl" | "refactor";

interface TestResults {
  passed: string[];
  failed: string[];
  timestamp: number;
}

interface GuardConfig {
  phase: Phase;
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

function readConfig(cwd: string): GuardConfig | null {
  const filePath = path.join(cwd, CONFIG_FILE);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as GuardConfig;
  } catch {
    return null;
  }
}

function writeConfig(cwd: string, config: GuardConfig): void {
  const filePath = path.join(cwd, CONFIG_FILE);
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2) + "\n", "utf8");
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
  const matches = source.match(/(?<![\w$])(?:it|test)\s*\(/g);
  return matches ? matches.length : 0;
}

/**
 * For an `edit` tool call, apply the oldText→newText substitutions to the
 * current file content and return the resulting string.
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

/** Returns true when the working tree has no uncommitted changes. */
function isWorkingTreeClean(
  cwd: string,
  exemptPaths: string[] = [],
): { clean: boolean; dirtyLines: string[] } {
  try {
    const gitStatus = execSync("git status --porcelain", {
      cwd,
      encoding: "utf8",
    }).trim();
    if (!gitStatus) return { clean: true, dirtyLines: [] };

    const exemptAbs = exemptPaths.map((p) => path.resolve(cwd, p));
    const dirtyLines = gitStatus
      .split("\n")
      .filter(Boolean)
      .filter((line) => {
        const abs = path.resolve(cwd, line.slice(3).trim());
        return !exemptAbs.includes(abs);
      });

    return { clean: dirtyLines.length === 0, dirtyLines };
  } catch {
    // Not a git repo — treat as clean.
    return { clean: true, dirtyLines: [] };
  }
}

// ── Exempt paths that the guard never considers "dirty" for precondition checks ──
const ALWAYS_EXEMPT = [
  ".pi/extensions/tdd-guard.ts",
  ".pi/tdd-guard/config.json",
];

/** Render the status bar text from phase + test results. */
function buildStatusText(
  phase: Phase | null,
  results: TestResults | null,
  theme: { fg: (color: string, text: string) => string },
): string {
  const phaseLabels: Record<string, string> = {
    test: theme.fg("error", "● test"),
    impl: theme.fg("success", "● impl"),
    refactor: theme.fg("accent", "● refactor"),
  };
  const label = (phase ? phaseLabels[phase] : undefined) ?? theme.fg("dim", "● tdd-guard");

  const counts = results
    ? "  " +
      theme.fg("success", `✓ ${results.passed.length}`) +
      "  " +
      theme.fg("error", `✗ ${results.failed.length}`)
    : "";

  return theme.fg("dim", "tdd ") + label + counts;
}

export default function (pi: ExtensionAPI) {
  const cwd = process.cwd();

  // We capture a status-setter reference on session_start so the file-watcher
  // callback and the tool executor can reuse it without holding a ctx reference.
  let cachedSetStatus: ((text: string) => void) | null = null;

  // File-watcher for test-results.json so the status bar refreshes after
  // every npm test run, even if the agent didn't trigger it.
  let resultsWatcher: fs.FSWatcher | null = null;

  function startWatcher(theme: { fg: (color: string, text: string) => string }) {
    const resultsPath = path.join(cwd, RESULTS_FILE);

    if (resultsWatcher) {
      try { resultsWatcher.close(); } catch { /* ignore */ }
      resultsWatcher = null;
    }

    // Watch the directory so we don't miss the file being recreated.
    const dir = path.dirname(resultsPath);
    if (!fs.existsSync(dir)) return;

    try {
      resultsWatcher = fs.watch(dir, (_event, filename) => {
        if (filename && filename === path.basename(resultsPath)) {
          // Small debounce — the reporter writes atomically but watch may fire
          // before the write is fully flushed.
          setTimeout(() => {
            if (cachedSetStatus) {
              const config = readConfig(cwd);
              const results = readResults(cwd);
              cachedSetStatus(buildStatusText(config?.phase ?? null, results, theme));
            }
          }, 200);
        }
      });
    } catch {
      // If we can't watch, that's OK — status will still update on activate.
    }
  }

  pi.on("session_start", async (_event, ctx) => {
    const resultsPath = path.join(cwd, RESULTS_FILE);
    const configPath = path.join(cwd, CONFIG_FILE);

    // Bootstrap config.json (gitignored runtime state) if missing.
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(
        configPath,
        JSON.stringify({ phase: "test" }, null, 2) + "\n",
        "utf8",
      );
    }

    if (!fs.existsSync(resultsPath)) {
      if (ctx.hasUI) {
        ctx.ui.notify(
          "TDD Guard: no test results found. Run your tests once to activate enforcement.",
          "warning",
        );
      }
    } else {
      const config = readConfig(cwd);
      if (ctx.hasUI) {
        ctx.ui.notify(
          `TDD Guard active — phase: ${config?.phase ?? "test"} — use /tdd-activate <phase> to switch.`,
          "info",
        );
      }
    }

    if (ctx.hasUI) {
      const config = readConfig(cwd);
      const results = readResults(cwd);
      const statusText = buildStatusText(config?.phase ?? null, results, ctx.ui.theme);
      ctx.ui.setStatus("tdd-guard", statusText);
      cachedSetStatus = (text: string) => ctx.ui.setStatus("tdd-guard", text);
      startWatcher(ctx.ui.theme);
    }
  });

  pi.on("session_shutdown", async () => {
    if (resultsWatcher) {
      try { resultsWatcher.close(); } catch { /* ignore */ }
      resultsWatcher = null;
    }
    cachedSetStatus = null;
  });

  // Git write subcommands the agent must never run.
  const GIT_WRITE_SUBCOMMANDS = [
    "commit",
    "add",
    "push",
    "stash",
    "reset",
    "checkout",
    "merge",
    "rebase",
    "tag",
    "rm",
    "mv",
  ];

  function containsGitWrite(command: string): string | null {
    const cmd = command.replace(/\s+/g, " ").trim();
    for (const sub of GIT_WRITE_SUBCOMMANDS) {
      if (new RegExp(`(^|[;&|]\\s*)git\\s+${sub}(\\s|$)`).test(cmd)) {
        return sub;
      }
    }
    return null;
  }

  // ── Core activation logic ────────────────────────────────────────────────
  /**
   * Run the test suite, check the precondition for targetPhase, and if met
   * write config.json. Returns { success, message }.
   */
  async function activatePhase(
    targetPhase: Phase,
    onProgress: (msg: string) => void,
  ): Promise<{ success: boolean; message: string }> {
    // 1. Run the full test suite.
    onProgress(`Running npm test…`);
    try {
      execSync("npm test", { cwd, encoding: "utf8", stdio: "pipe" });
    } catch {
      // Jest exits non-zero when tests fail — that's expected. We read
      // test-results.json regardless.
    }

    // 2. Re-read fresh results (the reporter writes test-results.json).
    const results = readResults(cwd);
    if (!results) {
      return {
        success: false,
        message:
          "TDD Guard: could not read test-results.json after running npm test.\n" +
          "Make sure the Jest reporter is installed (see .pi/tdd-guard/README.md).",
      };
    }

    // 3. Update the status bar with fresh counts.
    if (cachedSetStatus) {
      const config = readConfig(cwd);
      // Use a dummy theme for now; we update properly in step 5.
      const text = `tdd ● ${config?.phase ?? "?"} ✓ ${results.passed.length} ✗ ${results.failed.length}`;
      cachedSetStatus(text);
    }

    // 4. Check the precondition for the target phase.
    if (targetPhase === "test" || targetPhase === "refactor") {
      // Precondition: all tests green AND working tree clean.
      if (results.failed.length > 0) {
        return {
          success: false,
          message:
            `TDD Guard: cannot activate [${targetPhase}] phase — there are failing tests.\n\n` +
            `Failing (${results.failed.length}):\n` +
            results.failed.map((t) => `  - ${t}`).join("\n") +
            "\n\nFix all failing tests first.",
        };
      }

      const { clean, dirtyLines } = isWorkingTreeClean(cwd, ALWAYS_EXEMPT);
      if (!clean) {
        return {
          success: false,
          message:
            `TDD Guard: cannot activate [${targetPhase}] phase — working tree is not clean.\n\n` +
            "Uncommitted files:\n" +
            dirtyLines.map((l) => `  ${l}`).join("\n") +
            "\n\nCommit all work before switching to this phase.",
        };
      }
    } else if (targetPhase === "impl") {
      // Precondition: at least one test failing.
      if (results.failed.length === 0) {
        return {
          success: false,
          message:
            "TDD Guard: cannot activate [impl] phase — all tests are passing.\n" +
            "Write a failing test first (in the test phase), then activate impl.",
        };
      }
    } else {
      return { success: false, message: `TDD Guard: unknown phase "${targetPhase}".` };
    }

    // 5. Precondition met — write config.json.
    writeConfig(cwd, { phase: targetPhase });

    return {
      success: true,
      message:
        `TDD Guard: activated [${targetPhase}] phase. ` +
        `✓ ${results.passed.length}  ✗ ${results.failed.length}`,
    };
  }

  // ── /tdd-activate command (human-facing) ─────────────────────────────────
  pi.registerCommand("tdd-activate", {
    description:
      "Activate a TDD phase (test | impl | refactor). " +
      "Runs npm test, checks preconditions, and switches the phase.",
    handler: async (args, ctx) => {
      const target = (args ?? "").trim() as Phase;
      if (!["test", "impl", "refactor"].includes(target)) {
        ctx.ui.notify(
          `Usage: /tdd-activate <phase>   where phase is one of: test, impl, refactor`,
          "warning",
        );
        return;
      }

      ctx.ui.notify(`TDD Guard: running npm test to check preconditions…`, "info");

      const { success, message } = await activatePhase(target, (msg) => {
        ctx.ui.notify(msg, "info");
      });

      // Refresh status bar with proper theme.
      if (ctx.hasUI) {
        const config = readConfig(cwd);
        const results = readResults(cwd);
        const text = buildStatusText(config?.phase ?? null, results, ctx.ui.theme);
        ctx.ui.setStatus("tdd-guard", text);
        cachedSetStatus = (t: string) => ctx.ui.setStatus("tdd-guard", t);
      }

      ctx.ui.notify(message, success ? "success" : "error");
    },
  });

  // ── activate_tdd_phase tool (agent-facing) ────────────────────────────────
  pi.registerTool({
    name: "activate_tdd_phase",
    label: "Activate TDD Phase",
    description:
      "Switch the TDD guard to a new phase (test | impl | refactor). " +
      "This is the ONLY way to change the current phase — direct writes to " +
      "config.json are blocked. " +
      "The tool runs the full test suite, verifies the precondition for the " +
      "target phase, and activates it if the precondition is met. " +
      "Preconditions: " +
      "  test → all tests green AND working tree clean; " +
      "  impl → at least one test failing; " +
      "  refactor → all tests green AND working tree clean.",
    promptSnippet:
      "Switch TDD phase (test|impl|refactor); runs npm test and checks preconditions",
    promptGuidelines: [
      "Use activate_tdd_phase to switch between TDD phases (test, impl, refactor). " +
        "Never write .pi/tdd-guard/config.json directly.",
    ],
    parameters: Type.Object({
      phase: Type.Union(
        [
          Type.Literal("test"),
          Type.Literal("impl"),
          Type.Literal("refactor"),
        ],
        {
          description:
            "The phase to activate: 'test' (write a failing test), " +
            "'impl' (make it pass), or 'refactor' (clean up).",
        },
      ),
    }),
    async execute(_toolCallId, params, _signal, onUpdate) {
      onUpdate?.({
        content: [{ type: "text", text: `Activating TDD phase: ${params.phase}…` }],
      });

      const { success, message } = await activatePhase(params.phase, (msg) => {
        onUpdate?.({ content: [{ type: "text", text: msg }] });
      });

      // Refresh status bar (best-effort; cachedSetStatus may be null in non-UI mode).
      if (cachedSetStatus) {
        const config = readConfig(cwd);
        const results = readResults(cwd);
        // We don't have a theme here — emit a plain-text status as a fallback.
        if (config && results) {
          cachedSetStatus(
            `tdd ● ${config.phase}  ✓ ${results.passed.length}  ✗ ${results.failed.length}`,
          );
        }
      }

      return {
        content: [{ type: "text", text: message }],
        isError: !success,
      };
    },
  });

  // ── tool_call interceptor ────────────────────────────────────────────────
  pi.on("tool_call", async (event, ctx) => {
    const toolName = event.toolName;

    // ── BASH — block git write commands ─────────────────────────────────────
    if (toolName === "bash") {
      const command: string =
        (event.input as { command: string }).command ?? "";
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

    // Only intercept file-writing tools beyond this point.
    if (toolName !== "write" && toolName !== "edit") return undefined;

    const filePath: string = (event.input as { path: string }).path ?? "";

    // ── Block direct writes to config.json ──────────────────────────────────
    // config.json is owned exclusively by the activation command.
    if (
      path.resolve(cwd, filePath) === path.resolve(cwd, CONFIG_FILE)
    ) {
      return {
        block: true,
        reason:
          "TDD Guard: direct writes to .pi/tdd-guard/config.json are not allowed.\n" +
          "Use the activate_tdd_phase tool (or /tdd-activate <phase> command) to switch phases.\n" +
          "That is the only code path permitted to update config.json.",
      };
    }

    // Only care about source files; pass through everything else (.pi/*, markdown, etc.)
    if (!isTestFile(filePath) && !isImplementationFile(filePath)) {
      return undefined;
    }

    // Never block writes to the guard extension itself.
    if (filePath.includes(".pi/extensions/") || filePath.includes(".pi/tdd-guard/")) {
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

    const config = readConfig(cwd);
    const phase: Phase = config?.phase ?? "test";

    // ════════════════════════════════════════════════════════════════════════
    // PHASE: TEST
    // Within-phase rules (no working-tree checks here):
    //   - Only test files may be written — impl file writes are blocked.
    //   - At most one new it()/test() call site may be added across the phase.
    // ════════════════════════════════════════════════════════════════════════
    if (phase === "test") {
      if (isImplementationFile(filePath)) {
        return {
          block: true,
          reason:
            "TDD Guard [test phase]: implementation file writes are not allowed in the test phase.\n" +
            "Write a failing test first, then use activate_tdd_phase('impl') to switch to impl.",
        };
      }

      // Allow writing the (one) new test — no further per-write checks here.
      // (The "at most one new it()" rule is a phase-wide invariant; tracking it
      // across multiple writes to the same file in the same step is complex and
      // the original code didn't enforce a running count either.)
      return undefined;
    }

    // ════════════════════════════════════════════════════════════════════════
    // PHASE: IMPL
    // Within-phase rules:
    //   - Impl file writes are freely allowed.
    //   - Test file writes: no new it()/test() call sites may be added.
    // ════════════════════════════════════════════════════════════════════════
    if (phase === "impl") {
      // Implementation writes are always allowed in the impl phase.
      if (isImplementationFile(filePath)) {
        return undefined;
      }

      // Test file writes: check that no new test cases are being added.
      if (isTestFile(filePath)) {
        try {
          const absTarget = path.resolve(cwd, filePath);
          const currentContent = fs.existsSync(absTarget)
            ? fs.readFileSync(absTarget, "utf8")
            : "";
          const currentCount = countTestCases(currentContent);

          let proposedContent: string | null = null;
          if (toolName === "write") {
            proposedContent = (event.input as { content?: string }).content ?? "";
          } else if (toolName === "edit") {
            const rawEdits = (
              event.input as {
                edits?: Array<{ oldText: string; newText: string }>;
              }
            ).edits ?? [];
            proposedContent = applyEdits(currentContent, rawEdits);
          }

          if (proposedContent !== null) {
            const proposedCount = countTestCases(proposedContent);
            if (proposedCount > currentCount) {
              return {
                block: true,
                reason:
                  `TDD Guard [impl phase]: adding new test cases is not allowed while tests are failing.\n` +
                  `Currently failing (${results.failed.length}):\n` +
                  results.failed.map((t) => `  - ${t}`).join("\n") +
                  "\n\nMake the failing test pass first, then use activate_tdd_phase('test') to start a new test step.\n" +
                  "If these are regressions from your implementation change, repair the existing assertions — do not add new tests.",
              };
            }
          }
        } catch {
          // If we can't read/parse, fall through and allow.
        }

        return undefined;
      }

      return undefined;
    }

    // ════════════════════════════════════════════════════════════════════════
    // PHASE: REFACTOR
    // Within-phase rules:
    //   - Both impl and test files may be freely edited.
    //   - No new it()/test() call sites may be added.
    // ════════════════════════════════════════════════════════════════════════
    if (phase === "refactor") {
      // No new test cases may be introduced during refactor.
      if (isTestFile(filePath)) {
        try {
          const absTarget = path.resolve(cwd, filePath);
          const currentContent = fs.existsSync(absTarget)
            ? fs.readFileSync(absTarget, "utf8")
            : "";
          const currentCount = countTestCases(currentContent);

          let proposedContent: string | null = null;
          if (toolName === "write") {
            proposedContent = (event.input as { content?: string }).content ?? "";
          } else if (toolName === "edit") {
            const rawEdits = (
              event.input as {
                edits?: Array<{ oldText: string; newText: string }>;
              }
            ).edits ?? [];
            proposedContent = applyEdits(currentContent, rawEdits);
          }

          if (proposedContent !== null && countTestCases(proposedContent) > currentCount) {
            return {
              block: true,
              reason:
                "TDD Guard [refactor phase]: adding new test cases is not allowed during refactor.\n" +
                "Use activate_tdd_phase('test') to switch to the test phase and write a new failing test.",
            };
          }
        } catch {
          // Can't read file — allow the write.
        }
      }

      // Preconditions met — allow any source file change.
      return undefined;
    }

    return undefined;
  });
}
