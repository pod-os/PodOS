#!/usr/bin/env bash

set -e

echo "Cleaning up stuff for the homepage..."

rm -r ../homepage/docs/reference/core/_media
rm -r ../homepage/docs/reference/core/README.md
mv ../homepage/docs/reference/core/globals.md ../homepage/docs/reference/core/index.md

echo "Done."
