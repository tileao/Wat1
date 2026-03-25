const CACHE_NAME = 'wac6800-unified-standard-eaps-on-v1';
const APP_ASSETS = [
  './', './index.html', './styles.css', './app.js', './manifest.webmanifest', './data/chart-schema.json',
  './assets/offshore_standard_chart_clip.png', './docs/WAC charts 6800.pdf', './docs/page-07.png', './docs/page-09.png'
];
self.addEventListener('install', (event) => { event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))); });
self.addEventListener('activate', (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))); });
self.addEventListener('fetch', (event) => { event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request))); });
