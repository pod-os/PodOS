import { setupServiceWorker } from "https://cdn.jsdelivr.net/npm/@pod-os/elements@${POD_OS_ELEMENTS_VERSION}/dist/esm/index.js";

const CACHE_NAME = "pod-os-static-${POD_OS_ELEMENTS_VERSION}";
const CDN_URL_PATTERN = "https://cdn.jsdelivr.net/npm/@pod-os/";
const INITIALLY_CACHED_FILES = ["/", "./index.html", "./manifest.json"];

setupServiceWorker(self, INITIALLY_CACHED_FILES, CACHE_NAME, CDN_URL_PATTERN);
