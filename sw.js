const staticCacheName = 'kk-calc-v2'

const resourcesToPrecache = [
    '/kk-calc/', 
    '/index.html',
    '/assets/css/style-v001.css',
    '/assets/images/background.png',
    '/assets/js/main.js',
    '/assets/js/masker.js',
    '/assets/js/vue.js',
    '/assets/icons/icon-48x48.png', 
    '/assets/icons/icon-72x72.png', 
    '/assets/icons/icon-96x96.png', 
    '/assets/icons/icon-128x128.png', 
    '/assets/icons/icon-144x144.png', 
    '/assets/icons/icon-152x152.png', 
    '/assets/icons/icon-192x192.png', 
    '/assets/icons/icon-384x384.png', 
    '/assets/icons/icon-512x512.png' 
]

// CACHE FIRST

// self neste caso se refere ao service worker, e não ao window (browser)
]

// CACHE FIRST

// self neste caso se refere ao service worker, e não ao window (browser)
self.addEventListener('install', event => {

    self.skipWaiting()

    event.waitUntil(
        // armazena os itens de "resourcesToPrecache" no cache da aplicação
        caches.open(staticCacheName)
            .then(cache => cache.addAll(resourcesToPrecache))
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith('kk-calc-')))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            )
        })
    )
})

// agora vamos verificar se os itens já estão armazenados no cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cacheResponse => {

                let response = cacheResponse || fetch(event.request)

                if (response.redirected) {
                    return cleanResponse(response)
                } else {
                    return response
                }
            })
    )
})

function cleanResponse(response) {
    const clonedResponse = response.clone()

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise = 'body' in clonedResponse ?
        Promise.resolve(clonedResponse.body) :
        clonedResponse.blob();

    return bodyPromise.then(body => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        })
    })
}