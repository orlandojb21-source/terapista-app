var CACHE_NAME = 'terapista-app-v3';

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.includes('script.google.com')) return;
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) { return caches.delete(k); }));
    })
  );
});
