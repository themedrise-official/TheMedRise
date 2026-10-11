const CACHE_NAME = "medrise-cache-v2";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./notes.html",
  "./mocktest.html",
  "./dashboard.html",
  "./login.html",
  "./manifest.json",
  "./icons/medrise-192.png",
  "./icons/medrise-512.png",
  "./icons/medrise-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
