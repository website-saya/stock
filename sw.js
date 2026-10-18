const CACHE_NAME = "stock-opname-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon-512.png"
];

// Memasang service worker dan menyimpan file aplikasi
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Mengaktifkan service worker baru
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Mengambil file dari cache ketika offline
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    // Hanya menangani file dari alamat aplikasi ini
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(response => {
                        if (
                            response &&
                            response.status === 200 &&
                            response.type === "basic"
                        ) {
                            const salinan = response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, salinan);
                                });
                        }

                        return response;
                    });
            })
    );
});