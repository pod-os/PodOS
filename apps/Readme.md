# PodOS Apps

Apps based on PodOS

## PodOS Browser

A data browser that allows you to navigate through your Pod.

### Demo

A live version can be found at https://pod-os-browser.netlify.app

### Build

```shell
POD_OS_ELEMENTS_VERSION=latest make pos-app-browser
```

Adjust `POD_OS_ELEMENTS_VERSION` to an explicit version if you want to use a
specific one

For the latest build you can also run

```shell
npm run build:latest
```

### Deploy

#### Automatic deployment

An automatic deployment to https://pod-os-browser.netlify.app is done by the
[CI/CD pipeline](https://github.com/pod-os/PodOS/actions/workflows/ci-cd.yml)
with every new release of @pod-os/elements.

#### Custom deployment

Just upload `dist/pod-os-browser/index.html` to your Solid Pod or any webserver.

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

#### Test data

The tests fire up a Community Solid Server to provide test data, which can be
found in `./test-solid-server/data`.

Currently, the tests do not clean up the data, so for now a manual git reset has to be performed after running tests that change the data.