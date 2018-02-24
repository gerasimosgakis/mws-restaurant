(function() {
  'use strict';

  // variable with the name for the cache
  let staticCacheName = 'pages-cache-v1';

  var urlsToCache = [
    '.',
    'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300',
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'js/main.js',
    'js/restaurant_info.js',
    'js/dbhelper.js',
  ];

  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
    );
  });
  /**
   * Returns the request from cache if it exists
    otherwise it's fetched from the network and is stored in cache
   */
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          return caches.open(staticCacheName).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function(error) {
        console.log('Error, ', error);
      })
    );
  });

  /**
   * When new service worker is activated, if there is a new cache
   the old one is deleted
   */
  self.addEventListener('activate', function(event) {
    console.log('Activating new service worker...');

    var cacheWhitelist = [staticCacheName];

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Delete CACHE');
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

})();
