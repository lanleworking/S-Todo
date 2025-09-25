/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js',
)

const firebaseConfig = {
  apiKey: 'AIzaSyCtWeNNNl2EUX8peP2VQuoIPHMPYnzy3dk',
  authDomain: 'stodo-9e12e.firebaseapp.com',
  projectId: 'stodo-9e12e',
  storageBucket: 'stodo-9e12e.firebasestorage.app',
  messagingSenderId: '493412061739',
  appId: '1:493412061739:web:94d0865ae871754982d06e',
  measurementId: 'G-CKXBRH0ELB',
}

// Initialize Firebase (compat style)
firebase.initializeApp(firebaseConfig)

// Retrieve messaging instance
const messaging = firebase.messaging()

// Handle background messages
self.addEventListener('push', (event) => {
  const payload = event.data.json()

  // Only show if no focused client
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const isClientFocused = clientList.some((client) => client.focused)
        if (!isClientFocused && payload.notification) {
          self.registration.showNotification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/App_Logo.png',
          })
        }
      }),
  )
})
