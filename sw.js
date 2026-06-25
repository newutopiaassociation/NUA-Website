const CACHE_NAME = 'nua-cache-v13';

// Only pre-cache the core shell assets
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './assets/logo.png',
  './assets/favicon.png',
  './assets/leaf.svg'
];

// ── Install: pre-cache shell assets ──────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ── Activate: remove ALL old caches ──────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: smart strategy based on request type ───────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests (e.g. Google APIs)
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  // HTML pages → Network First (always get latest, fall back to cache offline)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Update the cache with the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
          return response;
        })
        .catch(() => caches.match(request)) // offline fallback
    );
    return;
  }

  // JS / CSS / Images → Cache First (fast, update cache in background)
  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
        }
        return response;
      });
      return cached || networkFetch;
    })
  );
});
