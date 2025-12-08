# PodOS contributing guide

Contributions to PodOS are very welcome. To get started please open an
[issue](https://github.com/pod-os/PodOS/issues) or start a
[discussion](https://github.com/pod-os/PodOS/discussions) with the ideas you
have.

All contributions eventually need to comply with our
[Definition of Done](./docs/contributing/definition-of-done.md) to be considered
done. But do not worry to much about it, you will get help with that where
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
