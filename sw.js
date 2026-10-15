const CACHE_NAME = "medrise-cache-v11";
const FILES = ["./","./index.html","./notes.html","./mocktest.html","./dashboard.html","./login.html","./admin.html","./pay.html","./community.html",
  "./manifest.json","./firebase.js","./auth-guard.js","./site-control.js","./chapters-data.js",
  "./icons/medrise-192.png","./icons/medrise-512.png","./icons/medrise-maskable-512.png"];
self.addEventListener("install", e => e.waitUntil(
  caches.open(CACHE_NAME).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE_NAME).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r, { ignoreSearch: true })));
});
