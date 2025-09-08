# Quick start - PodOS elements

1. Create a plain old html file
2. Add latest PodOS script tag and stylesheet to the head
3. Add a <pos-app></pos-app> to the body and use any PodOS element within it.
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

Also, check out the [🧑‍🏫 tutorial section](/tutorials) on practical guides.