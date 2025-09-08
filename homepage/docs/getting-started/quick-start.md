# Quick start - PodOS elements

1. Create a plain old html file
2. Add latest PodOS script tag and stylesheet to the head
3. Add a `<pos-app></pos-app>` to the body and use any PodOS element within it.
4. Host the page on any webserver (like your [Solid](../solid/index.md) Pod 😉)

Try this 🤩:

``` html linenums="1" hl_lines="5-12 15 16 17 19 22"
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
  />  <!-- (1)!  -->
</head>
<body>
<pos-app> <!-- (2)!  -->
  <pos-resource
    uri="https://solidproject.solidcommunity.net/profile/card#me"> <!-- (3)! --> 
    <h1> <!-- (4)! -->
      <pos-label /> <!-- (5)! -->
    </h1>
    <blockquote>
      <pos-description /> <!-- (6)! -->
    </blockquote>
  </pos-resource>
</pos-app>
</body>
</html>
```

1. PodOS can be easily included from any CDN
2. `<pos-app>` will provide PodOS to child elements. All other PodOS elements must be nested inside a `<pos-app>`
3. Loads the resource and sets the context for all the child elements
4. You can just combine normal HTML with PodOS elements
5. `<pos-label` renders a human-readable name of the resource
6. `<pos-description>` renders a renders a description of the resource

Check out the [📖 Storybook documentation](https://pod-os.github.io/PodOS/storybook/) to learn about the available elements.

Also, check out the [🧑‍🏫 tutorial section](../tutorials/index.md) on practical guides.