import axiosClient from '@/config/axios'
import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { detectPlatform } from '@/utils/platform'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Check if all required Firebase config values are present
const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
]
const missingKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key as keyof typeof firebaseConfig],
)

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration values:', missingKeys)
  throw new Error(
    `Firebase configuration is incomplete. Missing: ${missingKeys.join(', ')}`,
  )
}

const app = initializeApp(firebaseConfig)
let messaging: any = null

// Initialize messaging only if we're in a browser environment and Firebase is properly configured
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app)
  } catch (error) {
    console.error('Failed to initialize Firebase messaging:', error)
  }
}

// Ask permission & get FCM token
export async function requestNotificationPermission() {
  if (!messaging) {
    throw new Error('Firebase messaging is not initialized')
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error('Notification permission not granted')
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
  if (!vapidKey) {
    throw new Error('Firebase VAPID key is not configured')
  }

  const token = await getToken(messaging, {
    vapidKey,
  })

  // 👉 send this token to your backend so you can target this user
  await axiosClient.post('/user/store-token', {
    token,
    platform: detectPlatform(),
  })
  return token
}

// Listen to foreground messages
export function listenForMessages() {
  if (!messaging) {
    console.warn(
      'Firebase messaging is not initialized, skipping message listener',
    )
    return
  }

  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || 'Thông báo mới'
    const options = {
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/App_Logo.png',
      badge: '/App_Logo.png',
      tag: payload.messageId || 'notification',
      requireInteraction: false,
      data: payload.data || {},
    }

    // Show notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification(title, options)
    }
  })
}
