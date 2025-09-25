import axiosClient from '@/config/axios'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

// Ask permission & get FCM token
export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Notification permission not granted')
  }

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  })

  // 👉 send this token to your backend so you can target this user
  await axiosClient.post('/user/store-token', {
    token,
  })
  return token
}

// Listen to foreground messages
export function listenForMessages() {
  onMessage(messaging, (payload) => {
    alert(payload.notification?.title + '\n' + payload.notification?.body)
  })
}
