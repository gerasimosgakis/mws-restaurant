(function() {
  'use strict';

  // Register the service worker
  if (!navigator.serviceWorker) {
    console.log('Service worker not supported');
    return;
  }
  navigator.serviceWorker.register('service-worker.js')
  .then(function(registration) {
    console.log('Registered at scope:', registration.scope);
  })
  .catch(function(error) {
    console.log('Registration failed:', error);
  });
})();
