self.addEventListener('install', (event) => {
  console.log('Install ehaho!');

  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.addAll(['/', '/manifest.webmanifest', '/icon-192x192.png']);
    })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
  };

  event.waitUntil(
    self.registration
      .showNotification('eHaho Notification', options)
      .catch((error) => console.error('Error displaying notification:', error))
  );
});

this.addEventListener('fetch', (event) => {
  event.waitUntil(
    this.registration.showNotification('Welcome', {
      body: 'Welcome to ehaho',
      icon: '/icon-192x192.png',
    })
  );
  if (!navigator.online) {
    event.respondWith(
      caches.match(event.request).then((resp) => {
        if (resp) {
          return resp;
        }
        let requestUrl = event.request.clone();
        fetch(requestUrl);
      })
    );
  }
});

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
