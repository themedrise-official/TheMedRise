// MedRise service worker — network first, cached copy as offline fallback.
// Bump CACHE_NAME whenever you replace the site files so old copies are dropped.
const CACHE_NAME = "medrise-cache-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./notes.html",
  "./mocktest.html",
  "./dashboard.html",
  "./login.html",
  "./firebase.js",
  "./auth-guard.js",
  "./manifest.json",
  "./icons/medrise-192.png",
  "./icons/medrise-512.png",
  "./icons/medrise-maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // add files one by one so a single missing file (e.g. an icon)
      // does not make the whole install fail
      .then(cache => Promise.allSettled(FILES_TO_CACHE.map(file => cache.add(file))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("medrise-") && key !== CACHE_NAME)
            .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Firebase / Google / fonts: let the browser handle

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(request, { ignoreSearch: true }).then(cached => {
          if (cached) return cached;
          if (request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        })
      )
  );
});
