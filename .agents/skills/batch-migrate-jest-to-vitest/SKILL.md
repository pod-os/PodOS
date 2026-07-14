---
name: batch-migrate-jest-to-vitest
description: Migrate several stencil tests to vitest using subagents
---

Pick a stencil component unit tests from the list:

```
find elements -name '*.spec.tsx' ! -path '*integration*'
```

Pick one that can be easily migrated using the `migrate-jest-to-vitest` skill.

Start a subagent to migrate the test using this skill.

If the subagent asks questions / reports problems: revert the changes and document the issues into a markdown file. Skip this test.

If the test was successfully migrated, continue with the next one using a new subagent.

STOP if any problems occur that are not straightforward to solve or if no test is left that can be easily migrated.