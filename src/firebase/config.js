import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

// Web app's Firebase configuration for MESCE FM 108.1
const firebaseConfig = {
  apiKey: "AIzaSyAZviIWbR2CmDff1rCouFNpaIuTUc4VaOo",
  authDomain: "mescefm.firebaseapp.com",
  projectId: "mescefm",
  storageBucket: "mescefm.firebasestorage.app",
  messagingSenderId: "938076913716",
  appId: "1:938076913716:web:14059e7984b10ea1388a61",
  measurementId: "G-1X8XDV4BBH"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Analytics safely initialized in browser
export let analytics = null
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app)
    }
  }).catch(() => {
    // Ignore analytics error
  })
}
