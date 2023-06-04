const staticCacheName = 'kk-calc-v1'

const resourcesToPrecache = [
    '/index.html',
    '/assets/css/style-v001.css',
    '/assets/images/background.png',
    '/assets/js/main.js',
    '/assets/js/masker.js',
    '/assets/js/vue.js',
    '/assets/icons/android-chrome-96x96.png', 
    '/assets/icons/apple-touch-icon.png', 
    '/assets/icons/favicon-16x16.png', 
    '/assets/icons/favicon-32x32.png', 
    '/assets/icons/favicon.ico', 
    '/assets/icons/icon.png', 
    '/assets/icons/mstile-150x150.png', 
    '/assets/icons/safari-pinned-tab.svg', 
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