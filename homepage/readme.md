# PodOS homepage

Source code of the homepage at https://pod-os.org

## Run locally

Start a nix shell to get a shell with all prerequisites installed (first time to run might take a while):

```shell
nix-shell
```

Serve the page:

```shell
make serve
```

## Update reference docs

`@pod-os/elements` docs are copied over from `docs/elements` when you initially serve or build the page (by the [prepare.nu](build/prepare.nu) script).

The original docs are created as part of the Stencil build of `@pod-os/elements` and are committed to version control.

`@pod-os/core` docs are created by running `npm run build:doc -w core` in the project root and are directly generated into the correct homepage location. The generated readme.md can be deleted as well as the referenced assets, globals.md should be renamed to index.md. This could be automated, but is not for now. 

The reference docs have to be manually updated and committed with every new release. There is no versioning strategy yet.

## CI/CD

The homepage is build and deployed by [homepage.yml](../.github/workflows/homepage.yml) via Github Actions.