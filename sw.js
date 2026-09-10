/**
 * PostCode-BD Service Worker
 * Complete offline capability & instant caching strategy
 */

const CACHE_NAME = 'postcode-bd-v6';
const FONT_CACHE_NAME = 'postcode-bd-fonts-v2';

// Essential assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/contact.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/src/css/fonts.css',
  '/src/css/style.css',
  '/src/js/app.js',
  '/src/js/image-generator.js',
  '/src/data/postcodes-data.js',
  '/src/data/branch-offices-data.js',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-192.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
  '/postcodebd-banners.png',
  // Self-hosted fonts for complete offline support
  '/src/fonts/inter-400.ttf',
  '/src/fonts/inter-500.ttf',
  '/src/fonts/inter-600.ttf',
  '/src/fonts/inter-700.ttf',
  '/src/fonts/inter-800.ttf',
  '/src/fonts/jetbrains-mono-500.ttf',
  '/src/fonts/jetbrains-mono-700.ttf',
  '/src/fonts/noto-sans-bengali-400.ttf',
  '/src/fonts/noto-sans-bengali-500.ttf',
  '/src/fonts/noto-sans-bengali-600.ttf',
  '/src/fonts/noto-sans-bengali-700.ttf',
  '/src/fonts/noto-sans-bengali-800.ttf',
  '/src/fonts/plus-jakarta-sans-400.ttf',
  '/src/fonts/plus-jakarta-sans-500.ttf',
  '/src/fonts/plus-jakarta-sans-600.ttf',
  '/src/fonts/plus-jakarta-sans-700.ttf',
  '/src/fonts/plus-jakarta-sans-800.ttf'
];

// -----------------------------------------------------------------------------
// Service Worker Lifecycle: Install
// -----------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll with error resilience for each file
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch((err) => {
            console.warn(`[SW] Pre-cache failed for: ${url}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// -----------------------------------------------------------------------------
// Service Worker Lifecycle: Activate
// -----------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  const allowedCaches = [CACHE_NAME, FONT_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!allowedCaches.includes(cacheName)) {
            console.log(`[SW] Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// -----------------------------------------------------------------------------
// Service Worker Lifecycle: Fetch
// -----------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bypass Google Analytics & Tag Manager (network only, fail silently if offline)
  if (url.hostname.includes('google-analytics.com') || url.hostname.includes('googletagmanager.com')) {
    event.respondWith(
      fetch(request).catch(() => new Response('', { status: 200, statusText: 'Offline' }))
    );
    return;
  }

  // Navigation Requests (HTML Pages): Stale-While-Revalidate with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(async () => {
            // Offline: fallback to cached requested page, or index.html
            if (cachedResponse) return cachedResponse;
            if (url.pathname.includes('contact')) {
              return cache.match('/contact.html');
            }
            return cache.match('/index.html') || cache.match('/');
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Same-origin static assets: Stale-While-Revalidate strategy
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request, { ignoreSearch: true });

        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Network failed, we'll rely on cachedResponse
            return null;
          });

        // Return cached instantly if available; otherwise wait for network
        if (cachedResponse) {
          // Update cache in background (fire and forget)
          fetchPromise.catch(() => {});
          return cachedResponse;
        }

        const networkResult = await fetchPromise;
        if (networkResult) return networkResult;

        // Fallback for missing offline items
        return new Response('Offline resource unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
    );
    return;
  }

  // Default: Network with Cache fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      return fetch(request).catch(() => cached);
    })
  );
});

// -----------------------------------------------------------------------------
// Message Listener (Support skipWaiting updates)
// -----------------------------------------------------------------------------
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
