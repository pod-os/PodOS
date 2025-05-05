#!/usr/bin/env sh

export POD_OS_ELEMENTS_VERSION=${POD_OS_ELEMENTS_VERSION:-latest}
export POD_OS_APP_NAME=${1:-pos-app-browser}

echo "Building ${POD_OS_APP_NAME} with elements version ${POD_OS_ELEMENTS_VERSION}"

echo "Cleanup old build artifacts..."
rm -rf dist/"${POD_OS_APP_NAME}" && mkdir -p dist/"${POD_OS_APP_NAME}"

echo "Generating index.html..."
envsubst < index.html > dist/"${POD_OS_APP_NAME}"/index.html

echo "Copying favicon"
cp favicon-32x32.png dist/"${POD_OS_APP_NAME}"/favicon-32x32.png

echo "Generating manifest.json..."
envsubst < "${POD_OS_APP_NAME}".manifest.json > dist/"${POD_OS_APP_NAME}"/manifest.json

echo "Generating PWA assets"
npx pwa-asset-generator ../assets/logo.png ./dist/"${POD_OS_APP_NAME}"/icons --index ./dist/"${POD_OS_APP_NAME}"/index.html --manifest ./dist/"${POD_OS_APP_NAME}"/manifest.json

echo "All done! 🎉"