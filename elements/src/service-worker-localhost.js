/**
 * This is the service worker registered for local development
 */

importScripts('https://cdn.jsdelivr.net/npm/@pod-os/service-worker@latest/lib/index.js');

PodOsServiceWorker.setupServiceWorker(self, 'pod-os-dev-server', 'http://localhost:3333/build/', [
  '/',
  './index.html',
  './registerSW.js',
]);
