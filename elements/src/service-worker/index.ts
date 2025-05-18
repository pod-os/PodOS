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
  cacheOnInstall: string[] = ['index.html', 'manifest.json'],
) {
  const addResourcesToCache = async resources => {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
  };

  const putInCache = async (request, response) => {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  };

  const cacheFirst = async ({ request }) => {
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

  serviceWorker.addEventListener('activate', (event: any) => {
    console.log('Service worker activated');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== cacheName)
            .map(name => {
              console.log('Deleting old cache:', name);
              return caches.delete(name);
            }),
        );
      }),
    );
  });

  serviceWorker.addEventListener('install', (event: any) => {
    console.log('ServiceWorker installed');
    event.waitUntil(addResourcesToCache(cacheOnInstall));
  });

  serviceWorker.addEventListener('fetch', (event: any) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(caches.match('/'));
      return;
    }

    event.respondWith(
      cacheFirst({
        request: event.request,
      }),
    );
  });
}
