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

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// Get messaging instance
const messaging = firebase.messaging()

// Handle background messages the "Firebase way"
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  )

  const { title, body, image } = payload.notification || {}
  const notificationTitle = title || 'STodo'
  const notificationOptions = {
    body: body || "It's time for your task!",
    icon: image || '/App_Logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
