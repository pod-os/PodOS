/**
 * Wallaby Status Extension
 *
 * Shows Wallaby test status (pass/fail counts, coverage) in the pi status bar.
 * Polls Wallaby periodically to keep the status up to date.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  const STATUS_KEY = "wallaby";
  let pollInterval: ReturnType<typeof setInterval> | undefined;

  async function updateStatus(ctx: {
    ui: { setStatus: Function; theme: any };
  }) {
    const theme = ctx.ui.theme;

    try {
      // Use pi.exec to call wallaby tools indirectly isn't possible,
      // but we can use the Wallaby tools via the extension API.
      // Since we can't call Wallaby tools directly from extensions,
      // we'll set status based on the last known state.
      // Instead, let's use the tool_result event to capture Wallaby data.
    } catch {
      ctx.ui.setStatus(STATUS_KEY, theme.fg("dim", "🧪 Wallaby: ?"));
    }
  }

  // Track the latest Wallaby test state
  let lastAllCount = 0;
  let lastFailCount = 0;
  let lastCoverage = 0;
  let wallabyAvailable = false;

  function renderStatus(ctx: { ui: { setStatus: Function; theme: any } }) {
    const theme = ctx.ui.theme;

    if (!wallabyAvailable) {
      ctx.ui.setStatus(STATUS_KEY, theme.fg("dim", "🧪 Wallaby: waiting..."));
      return;
    }

    const passing = lastAllCount - lastFailCount;

    if (lastFailCount > 0) {
      const icon = theme.fg("error", "✗");
      const failText = theme.fg("error", `${lastFailCount} failing`);
      const passText = theme.fg("success", `${passing} passing`);
      const covText = theme.fg("dim", `${lastCoverage.toFixed(0)}% cov`);
      ctx.ui.setStatus(
        STATUS_KEY,
        `${icon} ${failText} ${theme.fg("dim", "/")} ${passText} ${theme.fg("dim", "·")} ${covText}`,
      );
    } else {
      const icon = theme.fg("success", "✓");
      const passText = theme.fg("success", `${passing} passing`);
      const covText = theme.fg("dim", `${lastCoverage.toFixed(0)}% cov`);
      ctx.ui.setStatus(
        STATUS_KEY,
        `${icon} ${passText} ${theme.fg("dim", "·")} ${covText}`,
      );
    }
  }

  // Listen for Wallaby tool results to capture test data
  pi.on("tool_result", async (event, ctx) => {
    if (
      event.toolName === "wallaby_wallaby_allTests" ||
      event.toolName === "wallaby_wallaby_failingTests"
    ) {
      try {
        // Parse the result content to extract test data
        const content = event.content;
        if (!content || content.length === 0) return;

        const textContent = content.find((c: any) => c.type === "text");
        if (!textContent) return;

        const data = JSON.parse(textContent.text);
        if (!data || !data.tests) return;

        if (event.toolName === "wallaby_wallaby_allTests") {
          lastAllCount = data.tests.length;
          lastFailCount = data.tests.filter(
            (t: any) => t.status !== "passed",
          ).length;
          if (data.coveragePercentage !== undefined) {
            lastCoverage = data.coveragePercentage;
          }
          wallabyAvailable = true;
        } else if (event.toolName === "wallaby_wallaby_failingTests") {
          lastFailCount = data.tests.length;
          if (data.coveragePercentage !== undefined) {
            lastCoverage = data.coveragePercentage;
          }
          wallabyAvailable = true;
        }

        renderStatus(ctx);
      } catch {
        // Ignore parse errors
      }
    }
  });

  pi.on("session_start", async (_event, ctx) => {
    const theme = ctx.ui.theme;
    ctx.ui.setStatus(STATUS_KEY, theme.fg("dim", "🧪 Wallaby: waiting..."));
  });

  pi.on("session_shutdown", async () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = undefined;
    }
  });
}
