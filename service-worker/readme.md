# PodOS Service Worker

A service worker setup package for PodOS applications that provides caching and offline capabilities.

## Features

- Cache-first strategy for specified resources
- Automatic cache cleanup on activation
- Configurable initial cache list
- Navigation request handling

## Usage

### Loading from CDN

The service worker setup can be loaded directly in your service worker file using `importScripts()`:

```javascript
importScripts('https://cdn.jsdelivr.net/npm/@pod-os/service-worker/lib/index.js');

PodOsServiceWorker.setupServiceWorker(
  self, // the serive worker itself
  'my-pod-os-app-v1', // cache name
  'https://cdn.jsdelivr.net/npm/@pod-os', // URL prefix for CDN resources to cache after fetching
  [ // static files to pre-load to cache
      '/',
      './index.html',
      './registerSW.js',
  ]
);

```