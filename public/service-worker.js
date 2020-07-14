const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/indexedDB.js",
  "/index.js",
  "/styles.css",
  "/icons/icon_192x192.317079d2f38bc5d2906f5408114bbcd3.png",
  "/icons/icon_512x512.273935f8ebdc8218f2ce26daa11d6844.png",
  "/dist/manifest.f9a65606950a2e044c2db540af3d9340.json"
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(PRECACHE).then(cache => {
      console.log("Your files were pre-cached successully!");
      return cache.addAll(FILES_TO_CACHE)
      // .then(self.skipWaiting())
      // .catch((err) => console.log(err))
    })
  );
  self.skipWaiting();
});

// Activate
// self.addEventListener("activate", event => {
//   const currentCaches = [PRECACHE, RUNTIME];
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
//     }).then(cachesToDelete => {
//       return Promise.all(cachesToDelete.map(cacheToDelete => {
//         return caches.delete(cacheToDelete);
//       }));
//     }).then(() => self.clients.claim())
//   );
// });

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== PRECACHE && key !== RUNTIME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(RUNTIME).then(cache => {
        return fetch(event.request).then(response => {
          if (response.status === 200) {
            cache.put(event.request.url, response.clone());
          }
              return response;
            })
            .catch(error => {
              return cache.match(event.request);
            });
        }).catch(error => console.log(error))
      );
      return;
  }

// self.addEventListener("fetch", event => {
//   if (event.request.url.includes("/api/")) {
//     event.respondWith(
//       caches.open(RUNTIME).then(cache => {
//         try {
//           const response = await fetch(event.request);
//           // If the response was good, clone it and store it in the cache.
//           if (response.status === 200) {
//             cache.put(event.request.url, response.clone());
//           }
//           return response;
//         }
//         catch (err) {
//           return cache.match(event.request);
//         }
//       }).catch(err => console.log(err))
//     );
//     return;
//   }
  event.respondWith(
    caches.open(PRECACHE).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request);
      });
    })
  );
});
