<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/logo-text-white.svg">
  <img alt="PodOS Logo" src="../assets/logo-text.svg">
</picture>


# PodOS elements

HTML custom elements (aka web components) for PodOS.

**Using data from Solid Pods as easy as writing HTML!**

![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

## Quick Start

1. Create a plain old html file
2. Add latest PodOS script tag and stylesheet to the `head`
3. Add a `<pos-app></pos-app>` to the `body` and use any PodOS element within it.
4. Host the page on any webserver (like your Solid Pod 😉)

Try this 🤩:

```html
<!DOCTYPE html>
<html>
<head>
  <title>PodOS Quick Start</title>
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/@pod-os/elements/dist/elements/elements.esm.js"
  ></script>
  <link
    href="https://cdn.jsdelivr.net/npm/@pod-os/elements/dist/elements/elements.css"
    rel="stylesheet"
  />
</head>
<body>
<pos-app> <!-- will provide a PodOS instance -->
  <pos-resource
    uri="https://solidproject.solidcommunity.net/profile/card#me"
  > <!-- Loads the resource and sets the context for all the child elements -->
    <h1> <!-- You can just combine normal HTML with PodOS elements -->
      <pos-label /> <!-- renders a human-readable name of the resource -->
    </h1>
    <blockquote>
      <pos-description /> <!-- renders a description of the resource -->
    </blockquote>
  </pos-resource>
</pos-app>
</body>
</html>
```

Check out the [📖 Storybook documentation](https://pod-os.github.io/PodOS/storybook/) to learn about the available elements.

Also, check out the [🧑‍🏫 tutorial section](http://pod-os.org/tutorials/) on practical guides.

## Development

### Run locally

Follow the [instructions in the projects main readme](../Readme.md#run-locally).

### Tests

To run all unit and integration tests execute:

```shell
npm test
```