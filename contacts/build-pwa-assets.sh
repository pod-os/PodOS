echo "Generating PWA assets"
npx pwa-asset-generator \
  --opaque false \
  --favicon \
  --padding "0" \
  --icon-only \
  --index ./src/index.html \
  ../assets/contacts-logo.svg \
  ./src/icons

npx pwa-asset-generator \
  --opaque false \
  --padding "calc(50vh - 25%) calc(50vw - 50%)" \
  --index ./src/index.html \
  --manifest ./src/manifest.json \
  ../assets/contacts-logo.svg \
  ./src/icons

echo "All done! 🎉"
