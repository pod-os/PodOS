After PodOS has been included on your page, let's take a look at how to show some data about things on the web.

We will go through these for steps:

1. Define a new app
2. Refer to a resource on the web
3. Show label and description of that resource
4. Mix and match with plain HTML
5. Show a picture of the resource

??? question "What is a resource?"

    A resource is anything on the Web identified by a URI (Uniform Resource Identifier).
    Most contents on the Web are *pages*, that can be found by their URL (Uniform Resource Locator).
    With PodOS and Solid, we are going beyond pages: *Anything* can be identified by a URI and when this URI resolves to
    data, then PodOS will be able to show it.

## Define a new app

Anything you want to do with PodOS needs to be wrapped in `<pos-app></pos-app>`

```html

<body>
<pos-app>
  <!-- your app goes here -->
</pos-app>
</body>
```

Whenever you add other PodOS elements to your page, make sure they are placed inside `pos-app`. This ensures that
the child elements get access to PodOS functionality.

## Refer to a resource

Now that we have an app, we can refer to a resource we want to display information about.

First, we need the URI of the resource in question. The PodOS project has a URI at solidcommunity.net, that serves some
data:

```
https://pod-os.solidcommunity.net/profile/card#me
```

To fetch the data of that resource and make it available for further usage, add a `<pos-resource>` into the app:

```html hl_lines="2-3"

<pos-app>
  <pos-resource uri="https://pod-os.solidcommunity.net/profile/card#me">
  </pos-resource>
</pos-app>
```

!!! tip

    If you already own a Solid Pod, you can also pass your WebID into the `uri` attribute. 

If you open your page now, you might notice that the resource URI will be fetched from the network already, but nothing
shows up yet. We will change that in a second.

## Show label and description

With `<pos-resource>` we set the context to a specific resource. Inside that element, we can now define what data we
want to show.

Let's add

1. `pos-label` to show a human-readable name of the resource
2. `pos-description` to get a short text describing what it is

```html hl_lines="3-4"

<pos-app>
  <pos-resource uri="https://pod-os.solidcommunity.net/profile/card#me">
    <pos-label></pos-label>
    <pos-description></pos-description>
  </pos-resource>
</pos-app>
```

!!! info

    Both `pos-label` and `pos-description` try to be "smart" about what information to show. On the web there are multiple
    terms that could be used to state resource labels, e.g. `rdfs:label`, `schema:name` and more.
    PodOS tries to use the most fitting terms and falls back to others until it finds something it could show. If nothing is availabe 
    `pos-label` will just show the resource URI as a last resort.

If you open the page now, you will see some content!

> PodOS An operating system for your personal online datastore

But it does not look very appealing, yet. This is where good old HTML and CSS come in.

## Mix in plain HTML and CSS

PodOS elements *extend* HTML, they do not replace it. On the contrary, you can use any HTML elements next to,
around or (depending on the element) even inside PodOS elements.

Let's create a `section` with a `h1` heading and a `blockquote`. Use `pos-label` as part of the a heading and put
`pos-description` into the `blockquote`:

```html

<section>
  <h1>
    Welcome to
    <pos-label></pos-label>
  </h1>
  <blockquote>
    <pos-description></pos-description>
  </blockquote>
</section>
```

Let's also add some style for `pos-app`:

```html

<style>
  pos-app {
    display: block;
    padding: 4rem;
    margin: 1rem;
    border-radius: 1rem;
    background-color: var(--pos-background-color);
  }
</style>
```

This should look a lot better already. But nothing compares to showing a picture.

!!! tip "Build in CSS variables"

    Did you notice the `--pos-background-color` we are using here? PodOS comes with several of those variables built-in. You can find the available variables in [global.css](https://github.com/pod-os/PodOS/blob/main/elements/src/global.css). `--pos-background-color` is aware of the preferred color scheme and adjust to light and dark mode.

## Showing a picture

Adding a picture works the same as adding a label and description. You might have guessed it by now, add a `pos-picture`
to your page:

```html hl_lines="2"

<pos-resource uri="https://pod-os.solidcommunity.net/profile/card#me">
  <pos-picture></pos-picture>
  <section>
    ...
  </section>
</pos-resource>
```

We added it right next to the section with our label and description, so that we can now apply a nice flex layout to the
`pos-resource`, so that the picture appears next to the text:

```css
pos-resource {
    display: flex;
    gap: 1rem;
    align-items: center;
}
```

## The final page

Now let's take a look at the page we have built! You can find a living example at [demo.html](./demo.html). You can use
your browsers "View source" feature to view the
source, [or find it on GitHub](https://github.com/pod-os/PodOS/blob/main/homepage/docs/getting-started/demo.html).

## Element reference

Elements we have used in this guide:

- [pos-app](../reference/elements/components/pos-app/index.md)
- [pos-resource](../reference/elements/components/pos-resource/index.md)
- [pos-label](../reference/elements/components/pos-label/index.md)
- [pos-description](../reference/elements/components/pos-description/index.md)
- [pos-picture](../reference/elements/components/pos-picture/index.md)