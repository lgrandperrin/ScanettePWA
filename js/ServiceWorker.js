var cacheName = 'scanette';
var appFiles = [
    '/js/app.js',
    '/js/DecoderWorker.js',
    '/js/exif.js',
    '/js/job.js',
    '/js/ServiceWorker.js',
    '/produit.csv',
    '/style.css'
];

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/ServiceWorker.js');
};

self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(appFiles);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
          console.log('[Service Worker] Fetching resource: '+e.request.url);
      return r || fetch(e.request).then((response) => {
                return caches.open(cacheName).then((cache) => {
          console.log('[Service Worker] Caching new resource: '+e.request.url);
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});