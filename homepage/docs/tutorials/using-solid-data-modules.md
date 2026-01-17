# Using Solid Data Modules

This tutorial will guide you through the process of using Solid Data Modules together with your PodOS app or web page.

We will show you how to dynamically load the bookmarks module and show a list of bookmarks from a public document.

While this tutorial uses the bookmarks module, you can use any Solid Data Module that is compatible with PodOS in the same way.

## Basic setup

First, we need to set up a basic html page with PodOS, as described in the [Getting Started](/docs/getting-started) tutorial. We add PodOS to the HTML `<head>` as usual:

```html
<script
  type="module"
  src="https://esm.sh/@pod-os/elements/dist/elements/elements.esm.js"
></script>
<link
  rel="stylesheet"
  href="https://esm.sh/@pod-os/elements/dist/elements/elements.css"
/>
```
To make a module available. We create an import map referencing it:

```html
<script type="importmap">
  {
    "imports": {
      "bookmarks": "https://esm.sh/@solid-data-modules/bookmarks-rdflib"
    }
  }
</script>
```

In the HTML `<body>` we set up a `<pos-app>` and a sections that will show the bookmarks loaded via the module later:

```html
<pos-app>
    <section id="bookmarks">
      <h1>Bookmarks</h1>
    </section>
</pos-app>
```

## Loading the module

To load the module, we need to dispatch a custom event named `pod-os:module`. It is important, that an element form **inside** the `<pos-app>` element dispatches the event, otherwise the module will not be loaded. Therefore, we are dispatching it from the section element, which is a child of the `<pos-app>` element:

```html
<script type="module">
  const section = document.getElementById("bookmarks");
  async function receiver(module) {
    // TBD
  }
  section.dispatchEvent(
    new CustomEvent("pod-os:module", {
      bubbles: true, // bubble up the DOM tree
      composed: true, // make sure to pass shadow dom boundaries
      detail: { module: "bookmarks", receiver },
    }),
  );
</script>
```
Let’s take a closer look at the event details:

- `module`: This is the module name, as defined in the import map.
- `receiver`: This is a function that will be called when the module is loaded. It will receive the module as an argument.

## Using the module

No we are ready to use the module from within the `receiver` function. The next steps depend on the module you are using and what you want to do with it.

In this case we are using the bookmarks module, so we can use the `listBookmarks` function to load the bookmarks from a public document:

```javascript
async function receiver(module) {
  const bookmarks = await module.listBookmarks(
    "https://pod-os.solidcommunity.net/bookmarks/index.ttl",
  );
}
```

## Next steps

Now it is up to you to use the data to update the dom and render a nice bookmarks list. For a full-fledged working example, take a look at the [demo page](./demo-bookmarks-module.html). Inspect the page sources to see how it is done. It is all plain HTML and JavaScript.