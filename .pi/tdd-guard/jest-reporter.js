/**
 * TDD Guard — Jest Reporter
 *
 * Writes test results to .pi/tdd-guard/test-results.json after every run.
 * The tdd-guard.ts extension reads this file before every write/edit.
 *
 * Setup — add to your jest.config (or jest field in package.json):
 *
 *   "reporters": [
 *     "default",
 *     "<rootDir>/.pi/tdd-guard/jest-reporter.js"
 *   ]
 *
 * If your jest config lives in a subdirectory (e.g. elements/), use:
 *
 *   "reporters": [
 *     "default",
 *     ["<rootDir>/../.pi/tdd-guard/jest-reporter.js", { "projectRoot": "<rootDir>/.." }]
 *   ]
 */

"use strict";

const fs = require("fs");
const path = require("path");

class TddGuardReporter {
  constructor(_globalConfig, options = {}) {
    // Default: the reporter lives at <projectRoot>/.pi/tdd-guard/jest-reporter.js
    // so walking two levels up gives the project root.
    const defaultRoot = path.resolve(__dirname, "../..");
    this._projectRoot = options.projectRoot ?? defaultRoot;
    this._outFile = path.join(
      this._projectRoot,
      ".pi/tdd-guard/test-results.json",
    );
  }

  onRunComplete(_contexts, results) {
    const passed = [];
    const failed = [];

    for (const suite of results.testResults) {
      for (const t of suite.testResults) {
        const name = [...t.ancestorTitles, t.title].join(" > ");
        if (t.status === "passed") passed.push(name);
        else if (t.status === "failed") failed.push(name);
      }
    }

    const data = {
      passed,
      failed,
      timestamp: Date.now(),
    };

    fs.mkdirSync(path.dirname(this._outFile), { recursive: true });
    fs.writeFileSync(this._outFile, JSON.stringify(data, null, 2));
  }
}

module.exports = TddGuardReporter;
