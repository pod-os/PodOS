#!/usr/bin/env bash
# Prints guidance when a Netlify deployment step failed.
# Usage: netlify-deploy-failure-help.sh "<what was being deployed>"
set -euo pipefail

target="${1:-an app}"

cat <<EOF
::error::Deploying ${target} to Netlify failed.
A common cause is an invalid or expired NETLIFY_AUTH_TOKEN, or a missing site ID secret.
To fix this:
  1. Create or renew a personal access token: https://app.netlify.com/user/applications/personal
  2. Store it as the NETLIFY_AUTH_TOKEN secret at https://github.com/pod-os/PodOS/settings/secrets/actions
More details: docs/contributing/deployment.md
EOF
