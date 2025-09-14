# Installing PodOS

## Using a CDN

Instead of installing, you can directly include PodOS into your html page by loading it from a CDN.

Include one of the following snippets to the `<head>` section of your html, depending on which CDN you would like to use.

=== "jsdelivr.net"

    ```html
    <script
        type="module"
        src="https://cdn.jsdelivr.net/npm/@pod-os/elements/dist/elements/elements.esm.js">
    </script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@pod-os/elements/dist/elements/elements.css"
    />
    ```

=== "esm.sh"

    ```html
    <script
        type="module"
        src="https://esm.sh/@pod-os/elements/dist/elements/elements.esm.js">
    </script>
    <link
      rel="stylesheet"
      href="https://esm.sh/@pod-os/elements/dist/elements/elements.css"
    />
    ```

=== "unpkg.com"

    ```html
    <script
        type="module"
        src="https://unpkg.com/@pod-os/elements/dist/elements/elements.esm.js">
    </script>
    <link
      rel="stylesheet"
      href="https://unpkg.com/@pod-os/elements/dist/elements/elements.css"
    />
    ```

!!! info

    The snippets above will point to the *latest* version of PodOS. If you want to stick to *specific* version, the CDNs allow to add an explicit version number to the URL, e.g. `https://cdn.jsdelivr.net/npm/@pod-os/elements`**@0.28.0**`/dist/elements/elements.esm.js`


## Installing from npm

If you do not want to rely on a CDN, you can install PodOS from npm:

```shell
npm install @pod-os/elements
```

If you are not using a bundler, you can include the JS and CSS files from the `node_modules` folder:

```html
<script
    type="module"
    src="node_modules/@pod-os/elements/dist/elements/elements.esm.js">
</script>
<link
  rel="stylesheet"
  href="node_modules/@pod-os/elements/dist/elements/elements.css"
/>
```

If you are using a bundler for your app, you can do the imports in your main JS / CSS files:

=== "JS import"
    
    In your app entry point, e.g. `index.js`, `main.ts` or `app.tsx` add:
    
    ```js
    import '@pod-os/elements';
    ```

=== "CSS import"

    In a global css file add:

    ```css
    @import '~@pod-os/elements/dist/elements/elements.css';
    ```