const CACHE_NAME = "pod-os-static-${POD_OS_ELEMENTS_VERSION}";
const CDN_URL_PATTERN = "https://cdn.jsdelivr.net/npm/@pod-os/";

const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response);
};

const cacheFirst = async ({ request }) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  const responseFromNetwork = await fetch(request.clone());
  if (request.url.startsWith(CDN_URL_PATTERN)) {
    putInCache(request, responseFromNetwork.clone());
  }

  return responseFromNetwork;
};

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("Deleting old cache:", name);
            return caches.delete(name);
          }),
      );
    }),
  );
});

self.addEventListener("install", (event) => {
  console.log("ServiceWorker installed");
  event.waitUntil(
    addResourcesToCache(["/", "./index.html", "./manifest.json"]),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    console.log("Navigating to cached home page");
    event.respondWith(caches.match("/"));
    return;
  }

  event.respondWith(
    cacheFirst({
      request: event.request,
    }),
  );
});
