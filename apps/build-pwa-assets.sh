echo "Generating PWA assets"
npx pwa-asset-generator \
  --opaque false \
  --favicon \
  --padding "0" \
  --icon-only \
  --index ./index.html \
  ../assets/logo.svg \
  ./icons

npx pwa-asset-generator \
  --opaque false \
  --padding "calc(50vh - 25%) calc(50vw - 50%)" \
  --index ./index.html \
  --manifest ./${POD_OS_APP_NAME}.manifest.json \
  ../assets/logo.svg \
  ./icons

echo "All done! 🎉"