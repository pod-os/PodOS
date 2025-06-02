importScripts(
  "https://cdn.jsdelivr.net/npm/@pod-os/service-worker@0.1.1/lib/index.js",
);

const CACHE_NAME = "pod-os-static-${POD_OS_ELEMENTS_VERSION}";
const CDN_URL_PATTERN = "https://cdn.jsdelivr.net/npm/@pod-os/";

PodOsServiceWorker.setupServiceWorker(self, CACHE_NAME, CDN_URL_PATTERN, [
  "/",
  "./index.html",
]);
