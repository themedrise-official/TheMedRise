const CACHE_NAME = "medrise-cache-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./notes.html",
  "./mocktest.html",
  "./dashboard.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Use individual adds so a single 404 doesn't abort the whole caching process on GitHub Pages
        return Promise.allSettled(
          APP_FILES.map(file => cache.add(file).catch(err => console.warn("Failed to cache: ", file, err)))
        );
      })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("medrise-cache-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Only handle requests from this origin.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, copy);
          });
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        if (request.mode === "navigate") {
          const home = await caches.match("./index.html") || await caches.match("index.html");
          if (home) return home;
        }

        return new Response("You are offline. Please reconnect and try again.", {
          status: 503,
          statusText: "Offline",
          headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      })
  );
});
