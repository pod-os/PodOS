# PodOS contributing guide

Contributions to PodOS are very welcome. To get started please open an
[issue](https://github.com/pod-os/PodOS/issues) or start a
[discussion](https://github.com/pod-os/PodOS/discussions) with the ideas you
have.

We'll chat about how best to implement your ideas in PodOS and its
[architecture](https://github.com/pod-os/PodOS/blob/main/docs/contributing/architecture.md),
as well as the conventions we use to maintain a healthy code base. We use
[conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and
test-driven development. Unit tests are written before implementation to provide
small and clear commits.
[New architectural decisions are documented](https://github.com/pod-os/PodOS/blob/main/docs/decisions/0000-use-markdown-architectural-decision-records.md).
In our reviews, we try to use
[conventional comments](https://conventionalcomments.org/). Commits are rebased
and merged and not squashed, retaining the fully commit log.

All contributions eventually need to comply with our
[Definition of Done](./docs/contributing/definition-of-done.md) to be considered
done. But do not worry too much about it, you will get help with that where
needed.

All contributions have to be made under the same [license](./LICENSE) as PodOS.

## Changelog Guidelines

When updating changelogs in `CHANGELOG.md`:

- **Add entries under `## Unreleased`** at the top of the file, not under
  version numbers
- **Keep descriptions user-centric and concise** - focus on what changed from
  the user's perspective
- **Use single-line descriptions** - avoid listing implementation details or
  internal mechanisms
- **Avoid deep nesting** - use single-level bullets for most entries; only use
  sub-bullets for multiple related changes to a single component
- **Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format**
  with sections: Added, Changed, Fixed, Removed, Security
- **Include documentation links** where applicable to help users discover more
  information
- **Be conservative with detail** - remember that implementation specifics
  belong in code comments and docs, not the changelog
