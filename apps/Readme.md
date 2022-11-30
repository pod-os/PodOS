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

### Deploy

#### Automatic deployment

An automatic deployment to https://pod-os-browser.netlify.app is done by the
[CI/CD pipeline](https://github.com/pod-os/PodOS/actions/workflows/ci-cd.yml)
with every new release of @pod-os/elements.

#### Custom deployment

Just upload `dist/pod-os-browser/index.html` to your Solid Pod or any webserver.
