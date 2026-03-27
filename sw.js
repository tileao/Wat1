const CACHE_NAME = 'wac6800-allprofiles-v3';
const APP_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './app.js?v=allprofiles-v3',
  './manifest.webmanifest',
  './README.md',
  './data/chart-schema.json',
  './data/clear-standard-exact.json',
  './data/clear-eapsoff-exact.json',
  './data/clear-eapson-exact.json',
  './data/confined-eapson-exact.json',
  './data/eaps-off-exact.json',
  './data/ibf-installed-exact.json',
  './data/ibf-cleararea-exact.json',
  './data/ibf-confined-exact.json',
  './data/confined-standard-exact.json',
  './data/confined-eapsoff-exact.json',
  './assets/offshore_standard_chart_clip.png',
  './docs/WAC charts 6800.pdf',
  './docs/page-01.png',
  './docs/page-02.png',
  './docs/page-03.png',
  './docs/page-06.png',
  './docs/page-07.png',
  './docs/page-08.png',
  './docs/page-09.png',
  './docs/page-10.png',
  './docs/page-11.png',
  './docs/page-04.png',
  './docs/page-05.png',
  './docs/page-12.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
