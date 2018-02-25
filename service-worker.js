(function() {
  'use strict';

  // variable with the name for the cache
  let staticCacheName = 'pages-cache-v1';

  // An array with all the assets we want to cache in first visit
  var urlsToCache = [
    '.',
    'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300',
    'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMR7eS2Ao.woff2',
    'index.html',
    'restaurant.html',
    'css/styles.css',
    'js/main.js',
    'js/restaurant_info.js',
    'js/dbhelper.js',
    'img/1-400_small.jpg',
    'img/2-400_small.jpg',
    'img/3-400_small.jpg',
    'img/4-400_small.jpg',
    'img/5-400_small.jpg',
    'img/6-400_small.jpg',
    'img/7-400_small.jpg',
    'img/8-400_small.jpg',
    'img/9-400_small.jpg',
    'img/10-400_small.jpg',
    'img/1-800_medium.jpg',
    'img/2-800_medium.jpg',
    'img/3-800_medium.jpg',
    'img/4-800_medium.jpg',
    'img/5-800_medium.jpg',
    'img/6-800_medium.jpg',
    'img/7-800_medium.jpg',
    'img/8-800_medium.jpg',
    'img/9-800_medium.jpg',
    'img/10-800_medium.jpg',
    'img/1-1600_large.jpg',
    'img/2-1600_large.jpg',
    'img/3-1600_large.jpg',
    'img/4-1600_large.jpg',
    'img/5-1600_large.jpg',
    'img/6-1600_large.jpg',
    'img/7-1600_large.jpg',
    'img/8-1600_large.jpg',
    'img/9-1600_large.jpg',
    'img/10-1600_large.jpg',
    'data/restaurants.json'
  ];

  /**
   * When we first visit the site the service worker is installed
     and this is when we cache the assets
  */
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
