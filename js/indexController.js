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

  // var socketUrl = new URL('', window.location);
  // //socketUrl.search += '&' + location.search.slice(1);
  // socketUrl.protocol = 'ws';

  // var ws = new WebSocket(socketUrl.href);

  navigator.serviceWorker.ready.then(swRegistration => {
    console.log('SW READY');
    return swRegistration.sync.register('myFirstSync');
  });
})();
