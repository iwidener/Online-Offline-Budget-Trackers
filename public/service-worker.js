const FILES_TO_CACHE = [
  "/",
  "/indexedDB.js",
  "/index.js",
  "/styles.css",
  "/icons/icon_192x192.317079d2f38bc5d2906f5408114bbcd3.png",
  "/icons/icon_512x512.273935f8ebdc8218f2ce26daa11d6844.png",
  "/dist/manifest.f9a65606950a2e044c2db540af3d9340.json"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
      .catch((err) => console.log(err))
  );
});

self.addEventListener("activate", event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(RUNTIME).then(cache => {
        return fetch(event.request).then(response => {
          return cache.put(event.request, response.clone()).then(() => {
            return response;
          });
        });
      })
    );
  }
});