# Authentication

You can allow users to sign in by adding a `pos-login` component to your app:

```html
<pos-app>
  <pos-login></pos-login>
</pos-app>
```

The most basic way to make use of an authenticated session is to use the authenticated fetch. This is just a `fetch`
function that behaves exactly like `window.fetch`, but will use the current user session to make authenticated request
and thus allows accessing private resources on a Solid Pod.

To access the authenticated fetch, subscribe to the `pod-os:loaded` event, which will pass it in the `detail`. Use it just like a regular fetch:

```html
<script>
  document.addEventListener("pod-os:loaded", async (event) => {
    const authFetch = event.detail.authenticatedFetch;
    const response = await authFetch("https://pod.example/alice/private/");
  });
</script>
```

> ℹ You can also pass it to other Solid libraries that need an authenticated fetch

## Observing session changes

You do not need to wait for the user to sign in before using the authenticated fetch, it also works like a regular fetch, while not being signed in.

Yet often you need to be aware of whether a user is currently signed in and who they are.

For this you can observe the session for changes, using the `os` instance also passed in the event `detail`:

```html
<script>
  document.addEventListener("pod-os:loaded", (event) => {
    const os = event.detail.os;
    event.detail.os.observeSession().subscribe(sessionInfo => {
      if (sessionInfo.isLoggedIn) {
        console.info("signed in as", sessionInfo.webId)
      } else {
        console.info("anonymous visitor")
      }
    })
  });
</script>
```

## Restoring sessions

Usually a user should stay signed in when refreshing the page or opening a new tab. It is as easy as adding the `restore-previous-session` attribute to `pos-app`:

```html
<pos-app restore-previous-session>
  <pos-login></pos-login>
</pos-app>
```

Yep, that's it already!

## Wrapping it up

- add `pos-login` element to your app
- listen to `pod-os:loaded` to get access to an authenticated fetch
- use `os.observeSession()` to be notified about session changes
- use `restore-previous-session` on `pos-app` to stay signed in on refresh

