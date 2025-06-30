#!/usr/bin/env sh

set -e

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

echo "Copying icons"
cp --recursive ./icons dist/"${POD_OS_APP_NAME}"/icons

echo "All done! 🎉"