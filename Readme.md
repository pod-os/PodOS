<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-text-white.svg">
  <img alt="PodOS Logo" src="./assets/logo-text.svg">
</picture>

# PodOS - Your personal online data operating system

![CI](https://github.com/pod-os/PodOS/actions/workflows/ci-cd.yml/badge.svg)


PodOS is an online operating system that helps you to access and mange your data on the web.

Thanks to the [Solid Protocol](https://solidproject.org), PodOS can access data anywhere on the web and you stay in full control of where to store it.

PodOS consists of:

* [PodOS elements](./elements) - A collection of web components to facilitate your data
* [PodOS core](./core) - Core logic to access and manipulate data on Solid Pods
* [Documentation](./docs)

## Using PodOS

The simplest way to use PodOS is by using one of the hosted apps PodOS provides:

- [PodOS browser](https://browser.pod-os.org) - A generic data browser
- [PodOS contacts](https://contacts.pod-os.org) - address book & contacts manager (🚧 under construction)

Another way to use PodOS is to use the [PodOS elements](./elements) on your site. You do not have to be a programmer to do that! It is as easy as adding some additional tags to an HTML page. Check it out!

## Developing PodOS

This section is relevant if you want to contribute to the source code of PodOS.

### Run locally

First install:

```shell
npm ci
```

Start up elements and a development solid server by running:

```shell
npm run dev:core
npm run dev:elements
npm run dev:server
```

Visit http://localhost:3333/?uri=http%3A%2F%2Flocalhost%3A3000%2Falice%2Fgames%2Fminecraft%23it to view the demo app
showing example data, or change the uri parameter to a resource of your choice.

The development Solid server is running at http://localhost:3000/ 

* [Development Solid Server](./dev-solid-server)
* [Test Data](./dev-solid-server/data)
* [Test Users](./dev-solid-server/Readme.md#Users)


### Contributing

You want to contribute? Great! Take a look into our [contributing guide](./CONTRIBUTING.md)