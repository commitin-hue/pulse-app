// Pulse Service Worker — network-first for HTML so updates propagate; cache-first for static assets.
// Bumping CACHE name triggers activate cleanup of old caches.
const CACHE = 'pulse-v3';

const PRECACHE = [
  './pulse.html',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './icon-192.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&display=swap',
];

// Install: pre-cache shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(PRECACHE.map(url => cache.add(url).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

// Activate: drop any older caches so stale HTML can't be served
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch:
//   - HTML / JSON / sw.js: network-first, fall back to cache when offline
//   - everything else (icons, fonts, react CDN): cache-first
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = e.request.url;
  const dest = e.request.destination;
  const isHTML = dest === 'document' || url.endsWith('.html');
  const isJSON = url.endsWith('.json') || url.includes('/raw/');
  const isSW   = url.endsWith('/sw.js');

  if (isHTML || isJSON || isSW) {
    // Network-first
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp.ok && isHTML) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else (fonts, icons, react CDN)
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp.ok && (url.includes('unpkg.com') || url.includes('fonts.g'))) {
          const clone = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return resp;
      });
    })
  );
});
