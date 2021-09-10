var CACHE_NAME = 'agenda-news'
var urlsToCache = [
  '/',
  '/index.html'
]

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  )
})

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('active', event => {
  var cacheWhiteList = ['agenda-task-manager']
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if(cacheWhiteList.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', function(event) {
  console.log('fetch', event);

  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        })
      })
    })
  )
})

