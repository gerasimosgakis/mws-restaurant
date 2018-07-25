// (function() {
//   'use strict';

// Register the service worker
if (navigator.serviceWorker) {
  
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    console.log('Registered at scope:', registration.scope);
  })
  .catch(function(error) {
    console.log('Registration failed:', error);
  });
}
  // navigator.serviceWorker.ready.then(swRegistration => {
  //   return swRegistration.sync.register('myFirstSync');
  // });
// })();
