/*if (!navigator.serviceWorker) {
  return;
}
navigator.serviceWorker.register('/sw.js').then(function() {
  console.log('Servicer worker registered');
}).catch(function() {
  console.log('Service worker failed to register');
});*/

(function() {
  'use strict';

  // TODO - 2: Register the service worker
  if (!navigator.serviceWorker) {
    console.log('Service worker not supported');
    return;
  }
  navigator.serviceWorker.register('service-worker.js', {
    scope: 'below/'
  })
  .then(function(registration) {
    console.log('Registered at scope:', registration.scope);
  })
  .catch(function(error) {
    console.log('Registration failed:', error);
  });
})();
