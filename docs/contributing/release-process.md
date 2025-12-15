# Release Process @pod-os/core & @pod-os/elements

## How to Release

### Workflow

1. **Develop normally** - commit your changes to `main`
2. **Automatic snapshots** - every commit publishes snapshot versions (e.g.,
   `0.24.0-rc.abc1234`)
3. **Preview environment** - automatically deployed for testing
4. **Review and approve** - when ready to release:
   - Go to GitHub Actions
   - Find your workflow run
   - Click "Review deployments"
   - Approve the `production` environment
5. **Done** - production release happens automatically, versions bump for next
   cycle

### What Gets Released

- **Snapshots:** Published on every commit with format `X.Y.Z-rc.{SHA}` (npm
  tag: `main`)
- **Releases:** Published when you approve production (npm tag: `latest`)
- **Packages:** `@pod-os/core` and `@pod-os/elements` released together

### Version Format

In the repository, versions use the `-next.0` suffix (e.g., `0.24.0-next.0`):

- Indicates the next version under development
- Follows npm semver prerelease convention
- Automatically bumped after each release

## How It Works

### Version Management

**In Git:**

- Package versions use `-next.0` suffix (e.g., `core: 0.24.0-next.0`,
  `elements: 0.35.0-next.0`)
- Elements depends on core using exact version:
  `"@pod-os/core": "0.24.0-next.0"`
- Exact version match ensures reliable workspace resolution during development

**During Build:**

- npm workspaces automatically resolve core to local workspace
- Core is built first, then elements
- Elements builds with the latest local core changes
- No version conflicts or manual dependency management needed

**During Publishing:**

- Snapshots: Version replaced with exact snapshot (e.g., `"0.24.0-rc.abc123"`)
- Releases: Version replaced with semver range (e.g., `"^0.24.0"`)
- Ensures published packages have correct explicit dependencies

### Pipeline Flow

**On Every Commit:**

1. Build and test core and elements
2. Publish core snapshot to npm
3. Update elements dependency to exact core snapshot version
4. Publish elements snapshot to npm
5. Deploy preview environment
6. Wait for manual approval (optional)

**On Approval:**

1. Strip `-next.0` from core version, publish to `latest` tag
2. Update elements dependency to released core version (semver range)
3. Strip `-next.0` from elements version, publish to `latest` tag
4. Deploy production environment
5. Automatically bump both packages to next `-next.0` version
6. Update elements dependency to match new core version
7. Update package-lock.json
8. Commit version bumps with `[skip ci]` to avoid triggering new build

### Dependency Chain

- **Core** is published first (independent package)
- **Elements** waits for core to be published before releasing
- Approval of `production` environment releases both packages sequentially
- Production deployment uses the released elements version

### Skip CI Mechanism

Version bump commits include `[skip ci]` in the commit message:

- Prevents infinite loop of builds
- GitHub Actions automatically skips workflow execution
- Next manual commit will trigger normal CI flow with new snapshot versions

### Snapshot vs Release

| Aspect     | Snapshot         | Release         |
| ---------- | ---------------- | --------------- |
| Trigger    | Every commit     | Manual approval |
| Version    | `X.Y.Z-rc.{SHA}` | `X.Y.Z`         |
| npm tag    | `main`           | `latest`        |
| Dependency | Exact version    | Semver range    |
| Purpose    | Testing/preview  | Production use  |
