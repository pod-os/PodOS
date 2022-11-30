# Deploy immutable web app to Netlify

## Context and Problem Statement

We want to make the PodOS browser available to the Solid Community for testing
and exploration. Other PodOS apps might follow in the future.

## Considered Options

- Deploy to a Solid Pod
- Deploy all static assets to [Netlify](https://netlify.app)
- Deploy
  [immutable web app](https://github.com/ImmutableWebApps/immutablewebapps.github.io)
  to Netlify and use static assets from CDN

## Decision Outcome

Chosen option: "Deploy immutable web app to Netlify", because

- only a single Solid App can exist on a domain (due to auth
  restrictions), so deploying to a Pod is not feasible
- Although currently only deploying the PodOS Browser, copying all static assets
  to Netlify for each future app seems to be overkill and unnecessary
- The static assets are already served by public CDNs like jsdelivr.com and can
  easily be built into a html page.
- [Benefits of immutable web apps](https://github.com/ImmutableWebApps/immutablewebapps.github.io#-benefits)
- We chose to deploy to Netlify as a host, because
  - other Solid Apps like Umai and Media Kraken use it successfully
  - signing up and doing a manual deploy was really easy to do
  - automating deployment looked also relatively straight-forward

## Links

 - [Netlify](https://netlify.app)
 - [Immutable Web Apps](https://github.com/ImmutableWebApps/immutablewebapps.github.io)
