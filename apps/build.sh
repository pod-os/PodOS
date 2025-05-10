#!/usr/bin/env sh

export POD_OS_ELEMENTS_VERSION=${POD_OS_ELEMENTS_VERSION:-latest}
export POD_OS_APP_NAME=${1:-pos-app-browser}

echo "Building ${POD_OS_APP_NAME} with elements version ${POD_OS_ELEMENTS_VERSION}"

echo "Cleanup old build artifacts..."
rm -rf dist/"${POD_OS_APP_NAME}" && mkdir -p dist/"${POD_OS_APP_NAME}"

echo "Generating index.html..."
envsubst < index.html > dist/"${POD_OS_APP_NAME}"/index.html

echo "Copying service worker"
envsubst < service-worker.js > dist/"${POD_OS_APP_NAME}"/service-worker.js

echo "Generating manifest.json..."
envsubst < "${POD_OS_APP_NAME}".manifest.json > dist/"${POD_OS_APP_NAME}"/manifest.json

echo "Generating PWA assets"
npx pwa-asset-generator \
  --opaque false \
  --favicon \
  --padding "0" \
  --icon-only \
  --index ./dist/"${POD_OS_APP_NAME}"/index.html \
  ../assets/logo.svg \
  ./dist/"${POD_OS_APP_NAME}"/icons

npx pwa-asset-generator \
  --opaque false \
  --padding "calc(50vh - 25%) calc(50vw - 50%)" \
  --index ./dist/"${POD_OS_APP_NAME}"/index.html \
  --manifest ./dist/"${POD_OS_APP_NAME}"/manifest.json \
  ../assets/logo.svg \
  ./dist/"${POD_OS_APP_NAME}"/icons




echo "All done! 🎉"