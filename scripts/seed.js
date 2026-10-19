// Standalone Seeding Script for MESCE FM 108.1
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import {
  INITIAL_RADIO_STATE,
  LIVE_CHAT_MESSAGES,
  SONG_REQUESTS,
  CAMPUS_POLLS,
  CONFESSIONS,
  CAMPUS_EVENTS,
  LOST_AND_FOUND,
  AUDITION_APPLICATIONS,
} from '../src/data/campusRadioData.js'

const firebaseConfig = {
  apiKey: "AIzaSyAZviIWbR2CmDff1rCouFNpaIuTUc4VaOo",
  authDomain: "mescefm.firebaseapp.com",
  projectId: "mescefm",
  storageBucket: "mescefm.firebasestorage.app",
  messagingSenderId: "938076913716",
  appId: "1:938076913716:web:14059e7984b10ea1388a61",
  measurementId: "G-1X8XDV4BBH"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  console.log('Seeding MESCE FM data into Firestore...')
  try {
    await setDoc(doc(db, 'radio_state', 'live'), INITIAL_RADIO_STATE)
    console.log('✓ radio_state/live seeded')

    for (const msg of LIVE_CHAT_MESSAGES) {
      await setDoc(doc(db, 'chat_messages', msg.id), { ...msg, createdAt: serverTimestamp() })
    }
    console.log('✓ chat_messages seeded')

    for (const req of SONG_REQUESTS) {
      await setDoc(doc(db, 'song_requests', req.id), { ...req, createdAt: serverTimestamp() })
    }
    console.log('✓ song_requests seeded')

    for (const poll of CAMPUS_POLLS) {
      await setDoc(doc(db, 'polls', poll.id), poll)
    }
    console.log('✓ polls seeded')

    for (const conf of CONFESSIONS) {
      await setDoc(doc(db, 'confessions', conf.id), { ...conf, createdAt: serverTimestamp() })
    }
    console.log('✓ confessions seeded')

    for (const ev of CAMPUS_EVENTS) {
      await setDoc(doc(db, 'events', ev.id), { ...ev, createdAt: serverTimestamp() })
    }
    console.log('✓ events seeded')

    for (const lf of LOST_AND_FOUND) {
      await setDoc(doc(db, 'lost_and_found', lf.id), { ...lf, createdAt: serverTimestamp() })
    }
    console.log('✓ lost_and_found seeded')

    for (const aud of AUDITION_APPLICATIONS) {
      await setDoc(doc(db, 'auditions', aud.id), { ...aud, createdAt: serverTimestamp() })
    }
    console.log('✓ auditions seeded')

    console.log('Done! All sample campus radio data is live in Firestore.')
    process.exit(0)
  } catch (err) {
    console.error('Seeding error:', err)
    process.exit(1)
  }
}

seed()
