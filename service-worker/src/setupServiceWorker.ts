/**
 * Helper function to set up a service worker for PodOS apps
 * @param serviceWorker - The service worker to configure
 * @param cacheName - Name of the cache to use
 * @param urlPrefixToCache - URL prefix that will be cached (e.g. of the CDN used)
 * @param cacheOnInstall - array of files to cache initially (e.g. ["index.html", "manifest.json"]
 */
export function setupServiceWorker(
  serviceWorker: ServiceWorker,
  cacheName: string,
  urlPrefixToCache: string,
  cacheOnInstall: string[] = ["index.html", "manifest.json"],
) {
  const addResourcesToCache = async (resources: RequestInfo[]) => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
  };

  const putInCache = async (request: RequestInfo, response: Response) => {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  };

  const cacheFirst = async ({ request }: { request: Request }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }

    const responseFromNetwork = await fetch(request.clone());
    if (request.url.startsWith(urlPrefixToCache)) {
      putInCache(request, responseFromNetwork.clone());
    }

    return responseFromNetwork;
  };

  serviceWorker.addEventListener("activate", (event: Event) => {
    const extEvent = event as ExtendableEvent;
    console.log("Service worker activated");
    extEvent.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== cacheName)
            .map((name) => {
              console.log("Deleting old cache:", name);
              return caches.delete(name);
            }),
        );
      }),
    );
  });

  serviceWorker.addEventListener("install", (event) => {
    console.log("ServiceWorker installed");
    (event as FetchEvent).waitUntil(addResourcesToCache(cacheOnInstall));
  });

  serviceWorker.addEventListener("fetch", async (event) => {
    const fetchEvent = event as FetchEvent;
    if (fetchEvent.request.mode === "navigate") {
      const match = await caches.match("/");
      if (match) {
        fetchEvent.respondWith(match);
      }
      return;
    }

    fetchEvent.respondWith(
      cacheFirst({
        request: fetchEvent.request,
      }),
    );
  });
}
