const CACHE_NAME = 'pianopwa-free-v1.0.4-white-key-real-fix';
const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=white-key-real-fix-4',
  './manifest.webmanifest',
  './src/logic.js?v=white-key-real-fix-4',
  './src/content.js?v=white-key-real-fix-4',
  './src/app.js?v=white-key-real-fix-4',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(APP_SHELL.map(url => cache.add(new Request(url, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;

  if (!sameOrigin) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => {
        if (cached) return cached;
        if (event.request.mode === 'navigate') return caches.match('./index.html');
        return cached;
      }))
  );
});
