# PodOS Apps

Apps based on PodOS

## PodOS Browser

A data browser that allows you to navigate through your Pod.

### Demo

A live version can be found at https://browser.pod-os.org

### Build

Just can just run `make` to build the latest version, or be more specific if needed:

```shell
POD_OS_ELEMENTS_VERSION=latest make pos-app-browser
```

Adjust `POD_OS_ELEMENTS_VERSION` to an explicit version if you want to use a
specific one

For the latest build you can also run

```shell
npm run build:latest
```

#### Build PWA assets

PWA assets (icons / manifest) have been pre-built and added to version control. In case they need to be rebuild, the script `./build-pwa-assets.sh` can be used.

### Deploy

#### Automatic deployment

An automatic deployment to https://browser.pod-os.org is done by the
[CI/CD pipeline](https://github.com/pod-os/PodOS/actions/workflows/ci-cd.yml)
with every new release of @pod-os/elements.

#### Custom deployment

Just upload `dist/pod-os-browser/` to your Solid Pod or any webserver.

### End-to-End tests

This repository also contains End-to-End tests for the PodOS Browser

#### Initial setup

Initially you need to install the dependencies and the browsers for Playwright
once by running:

```shell
npm ci
npx playwright install
```

#### Run the tests

First build the app as described above, then run

```shell
npm test
```

It is also possible to run the tests against the local dev server of [PodOS elements](../elements). To do this you have to start PodOS elements locally as described in the README there. After that run:

```shell
npm run test:elements
```

To start the test with the Playwright UI run one of those:

```shell
npm run test:ui
npm run test:elements:ui
```

#### Test data

The tests fire up a Community Solid Server to provide test data, which can be
found in `./test-solid-server/data`.

Currently, the tests do not clean up the data, so for now a manual git reset has to be performed after running tests that change the data.