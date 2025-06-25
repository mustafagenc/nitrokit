self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Bildirim', body: event.data && event.data.text() };
  }

  const title = data.title || 'Yeni Bildirim';
  const options = {
    body: data.body || 'Yeni bir bildiriminiz var.',
    icon: data.icon || '/favicon/android-chrome-192x192.png',
    badge: data.badge || '/favicon/android-chrome-192x192.png',
    image: data.image,
    data: data.url ? { url: data.url } : {},
    actions: data.actions || [],
    vibrate: data.vibrate || [100, 50, 100],
    requireInteraction: data.requireInteraction || false,
    tag: data.tag,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url;
  if (url) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
}); 