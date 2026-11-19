# Netlify Deployments

PodOS apps are deployed to [Netlify](https://netlify.app) from GitHub Actions
(see [ADR 0005](../decisions/0005-deploy-immutable-web-app-to-netlify.md) for
why).

## Secrets

Deployments authenticate with a Netlify **personal access token**, stored as
the `NETLIFY_AUTH_TOKEN` repository secret, plus a per-app site ID secret.

## When a Deployment Fails

When a deployment step fails in GitHub Actions, the pipeline prints an error
message pointing to this page. The most common cause is an **invalid or
expired token**.

### Fix: Renew the Netlify token

1. Create (or renew) a personal access token:
   <https://app.netlify.com/user/applications/personal>
2. Store it as the `NETLIFY_AUTH_TOKEN` secret (and check the site ID secrets)
   in this repository:
   <https://github.com/pod-os/PodOS/settings/secrets/actions>

