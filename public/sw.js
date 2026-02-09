// Service Worker pour PWA - SellExpress
const CACHE_NAME = 'sellexpress-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
]

// Installation du cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert')
        return cache.addAll(urlsToCache)
      })
  )
})

// Activation du nouveau cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone la requête
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(response => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone la réponse
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache)
            })

          return response
        })
      })
      .catch(() => {
        // Offline fallback
        return caches.match('/offline.html')
      })
  )
})

// Écouter les messages du client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Notification push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification SellExpress',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('SellExpress', options)
  )
})

// Gestion des clics sur notifications
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  } else if (event.action === 'close') {
    // Fermer la notification
  } else {
    // Action par défaut
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Synchronisation en arrière-plan
self.addEventListener('sync', event => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders())
  }
})

async function syncOrders() {
  // Logique de synchronisation des commandes
  console.log('Synchronisation des commandes en arrière-plan')
}
