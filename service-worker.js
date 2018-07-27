//self.importScripts('js/idb.js');
// variable with the name for the cache
let staticCacheName = 'pages-cache-v1';
let live = 'live';

// const dbPromise = idb.open("restaurants", 2, upgradeDB => {
//   switch (upgradeDB.oldVersion) {
//     case 0:
//       upgradeDB.createObjectStore("restaurants", {keyPath: "id"});
//     case 1:
//       {
//         const reviewsStore = upgradeDB.createObjectStore("reviews", {keyPath: "id"});
//         reviewsStore.createIndex("restaurant_id", "restaurant_id");
//       }
//   }
// });

// An array with all the assets we want to cache in first visit
var urlsToCache = [
  // '/',
  // 'https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300',
  // 'https://fonts.gstatic.com/s/opensanscondensed/v12/z7NFdQDnbTkabZAIOl9il_O6KJj73e7Ff1GhDuXMR7eS2Ao.woff2',
  // 'https://use.fontawesome.com/releases/v5.0.13/css/all.css',
  'index.html',
  //'restaurant.html',
  'css/styles.css',
  'js/main.js',
  'js/restaurant_info.js',
  'js/dbhelper.js',
  'js/idb.js',
  // 'js/swRegister.js',
  // 'img/1-400_small.jpg',
  // 'img/2-400_small.jpg',
  // 'img/3-400_small.jpg',
  // 'img/4-400_small.jpg',
  // 'img/5-400_small.jpg',
  // 'img/6-400_small.jpg',
  // 'img/7-400_small.jpg',
  // 'img/8-400_small.jpg',
  // 'img/9-400_small.jpg',
  // 'img/10-400_small.jpg',
  // 'img/1-800_medium.jpg',
  // 'img/2-800_medium.jpg',
  // 'img/3-800_medium.jpg',
  // 'img/4-800_medium.jpg',
  // 'img/5-800_medium.jpg',
  // 'img/6-800_medium.jpg',
  // 'img/7-800_medium.jpg',
  // 'img/8-800_medium.jpg',
  // 'img/9-800_medium.jpg',
  // 'img/10-800_medium.jpg',
  // 'img/1-1600_large.jpg',
  // 'img/2-1600_large.jpg',
  // 'img/3-1600_large.jpg',
  // 'img/4-1600_large.jpg',
  // 'img/5-1600_large.jpg',
  // 'img/6-1600_large.jpg',
  // 'img/7-1600_large.jpg',
  // 'img/8-1600_large.jpg',
  // 'img/9-1600_large.jpg',
  // 'img/10-1600_large.jpg',
  // 'manifest.json'
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
    .then(self.skipWaiting())
  );
});
/**
 * Returns the request from cache if it exists
  otherwise it's fetched from the network and is stored in cache
  */
// self.addEventListener('fetch', event => {
//   let cacheRequest = event.request;
//   if (event.request.url.indexOf('restaurant,html') > -1) {
//     const cacheURL  = 'restaurant.html';
//     cacheRequest = new Request(cacheURL);
//   }

//   // Requests going to the API get handled separately from those going to other
//   // destinations
//   const checkURL = new URL(event.request.url);
//   if (checkURL.port === '1337') {
//     const parts = checkURL
//       .pathname.split('/');
//     let id = checkURL
//       .searchParams
//       .get('restaurant_id') - 0;
//       console.log('ID', id);
//     if (!id) {
//       if (checkURL.pathname.indexOf("restaurants")) {
//         id = parts[parts.length - 1] === "restaurants"
//           ? "-1"
//           : parts[parts.length - 1];
//       } else {
//         id = checkURL
//           .searchParams
//           .get("restaurant_id");
//       }
//     }
//     console.log('!ID', id);
//     console.log('handleAJAXEvent');
//     handleAJAXEvent(event, id);
//   }
//   else {
//     console.log('handleNonAJAXEvent');
//     // handleNonAJAXEvent(event, cacheRequest);
//   }
// });

// const handleAJAXEvent = (event, id) => {
//   // Only use caching for GET events
//   //if (event.request.method !== "GET") {
//     return fetch(event.request)
//       .then(fetchResponse => fetchResponse.json())
//       .then(json => {
//         return json
//       });
//   //}

//   // Split these request for handling restaurants vs reviews
//   if (event.request.url.indexOf("reviews") > -1) {
//     handleReviewsEvent(event, id);
//   } else {
//     handleRestaurantEvent(event, id);
//   }
// }

// const handleReviewsEvent = (event, id) => {
//   event.respondWith(dbPromise.then(db => {
//     return db
//       .transaction("reviews")
//       .objectStore("reviews")
//       .index("restaurant_id")
//       .getAll(id);
//   }).then(data => {
//     return (data.length && data) || fetch(event.request)
//       .then(fetchResponse => fetchResponse.json())
//       .then(data => {
//         return dbPromise.then(idb => {
//           const itx = idb.transaction("reviews", "readwrite");
//           const store = itx.objectStore("reviews");
//           data.forEach(review => {
//             store.put({id: review.id, "restaurant_id": review["restaurant_id"], data: review});
//           })
//           return data;
//         })
//       })
//   }).then(finalResponse => {
//     if (finalResponse[0].data) {
//       // Need to transform the data to the proper format
//       const mapResponse = finalResponse.map(review => review.data);
//       return new Response(JSON.stringify(mapResponse));
//     }
//     return new Response(JSON.stringify(finalResponse));
//   }).catch(error => {
//     return new Response("Error fetching data", {status: 500})
//   }))
// }

// const handleRestaurantEvent = (event, id) => {
//   // Check the IndexedDB to see if the JSON for the API has already been stored
//   // there. If so, return that. If not, request it from the API, store it, and
//   // then return it back.
//   event.respondWith(dbPromise.then(db => {
//     return db
//       .transaction("restaurants")
//       .objectStore("restaurants")
//       .get(id);
//   }).then(data => {
//     return (data && data.data) || fetch(event.request)
//       .then(fetchResponse => fetchResponse.json())
//       .then(json => {
//         return dbPromise.then(db => {
//           const tx = db.transaction("restaurants", "readwrite");
//           const store = tx.objectStore("restaurants");
//           store.put({id: id, data: json});
//           return json;
//         });
//       });
//   }).then(finalResponse => {
//     return new Response(JSON.stringify(finalResponse));
//   }).catch(error => {
//     return new Response("Error fetching data", {status: 500});
//   }));
// };

// const handleNonAJAXEvent = (event, cacheRequest) => {
//   console.log('NONAJAX');
//   // Check if the HTML request has previously been cached. If so, return the
//   // response from the cache. If not, fetch the request, cache it, and then return
//   // it.
//   event.respondWith(caches.match(cacheRequest).then(response => {
//     return (response || fetch(event.request).then(fetchResponse => {
//       return caches
//         .open(cacheID)
//         .then(cache => {
//           if (fetchResponse.url.indexOf("browser-sync") === -1) {
//             cache.put(event.request, fetchResponse.clone());
//           }
//           return fetchResponse;
//         });
//     }).catch(error => {
//       if (event.request.url.indexOf(".jpg") > -1) {
//         return caches.match("/img/na.png");
//       }
//       return new Response("Application is not connected to the internet", {
//         status: 404,
//         statusText: "Application is not connected to the internet"
//       });
//     }));
//   }));
// };
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       if (response) {
//         return response;
//       }
//       return fetch(event.request).then(function(response) {
//         return caches.open(staticCacheName).then(function(cache) {
//           if (event.request.url.indexOf('restaurants') < 0) {
//             cache.put(event.request.url, response.clone());
//           }
//           return response;
//         });
//       });
//     }).catch(function(error) {
//       console.log('Error, ', error);
//     })
//   );
// });

self.addEventListener('fetch', event => {
  const saveUrl = event.request.url.split(/[?#]/)[0];

  if (saveUrl.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(saveUrl).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(live).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(saveUrl, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
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

// let submit = false;

// self.addEventListener('message', (event) => {
//   if (event.data.action == 'formSubmitted') {
//     submit = true;
//     console.log(submit);
//   }
// })

// // self.addEventListener('sync', event => {
// //   if (event.tag == 'myFirstSync') {
// //     event.waitUntil(prom());
// //   }
// // })

// // self.addEventListener('periodicsync', function(event) {
// //   if (event.registration.tag == 'get-latest-news') {
// //     event.waitUntil(fetchAndCacheLatestNews());
// //   }
// //   else {
// //     // unknown sync, may be old, best to unregister
// //     event.registration.unregister();
// //   }
// // });


// // const prom = new Promise((resolve) => {
// //   if (navigator.onLine) {
// //     console.log('YAYYYYYYYYYYYYYY');
// //     resolve;
// //   }
// // });