import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'
import {
  INITIAL_RADIO_STATE,
  SHOWS,
  HOSTS,
  PODCASTS,
  LIVE_CHAT_MESSAGES,
  SONG_REQUESTS,
  CAMPUS_POLLS,
  CONFESSIONS,
  CAMPUS_EVENTS,
  LOST_AND_FOUND,
  OPPORTUNITIES,
  AUDITION_APPLICATIONS,
} from '../data/campusRadioData'

// 1. Radio State
export function subscribeRadioState(callback) {
  try {
    const docRef = doc(db, 'radio_state', 'live')
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.data())
        } else {
          // Document does not exist yet; auto seed it
          setDoc(docRef, INITIAL_RADIO_STATE).catch(console.warn)
          callback(INITIAL_RADIO_STATE)
        }
      },
      (err) => {
        console.warn('Firestore radio_state sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeRadioState error:', err)
    return () => {}
  }
}

export async function updateRadioStateInDb(data) {
  try {
    const docRef = doc(db, 'radio_state', 'live')
    await setDoc(docRef, data, { merge: true })
  } catch (err) {
    console.error('Failed to update live radio state:', err)
    throw err
  }
}

// 2. Chat Messages
export function subscribeChatMessages(callback) {
  try {
    const colRef = collection(db, 'chat_messages')
    const q = query(colRef, orderBy('createdAt', 'asc'))
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore chat sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeChatMessages error:', err)
    return () => {}
  }
}

export async function sendChatMessageToDb(msg) {
  try {
    const colRef = collection(db, 'chat_messages')
    await addDoc(colRef, {
      ...msg,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to send chat message:', err)
    throw err
  }
}

// 3. Song Requests
export function subscribeSongRequests(callback) {
  try {
    const colRef = collection(db, 'song_requests')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore song_requests sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeSongRequests error:', err)
    return () => {}
  }
}

export async function addSongRequestToDb(req) {
  try {
    const colRef = collection(db, 'song_requests')
    await addDoc(colRef, {
      ...req,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to add song request:', err)
    throw err
  }
}

export async function updateSongRequestStatusInDb(id, status) {
  try {
    const docRef = doc(db, 'song_requests', id)
    await updateDoc(docRef, { status })
  } catch (err) {
    console.error('Failed to update request status:', err)
    throw err
  }
}

export async function deleteSongRequestFromDb(id) {
  try {
    const docRef = doc(db, 'song_requests', id)
    await deleteDoc(docRef)
  } catch (err) {
    console.error('Failed to delete request:', err)
    throw err
  }
}

// 4. Polls
export function subscribePolls(callback) {
  try {
    const colRef = collection(db, 'polls')
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore polls sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribePolls error:', err)
    return () => {}
  }
}

export async function votePollInDb(pollId, optionId, currentPoll) {
  try {
    const docRef = doc(db, 'polls', pollId)
    const updatedOptions = currentPoll.options.map((opt) =>
      opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
    )
    await updateDoc(docRef, {
      totalVotes: (currentPoll.totalVotes || 0) + 1,
      options: updatedOptions,
    })
  } catch (err) {
    console.error('Failed to submit poll vote:', err)
    throw err
  }
}

// 5. Confessions Wall
export function subscribeConfessions(callback) {
  try {
    const colRef = collection(db, 'confessions')
    const q = query(colRef, orderBy('createdAt', 'desc'))
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore confessions sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeConfessions error:', err)
    return () => {}
  }
}

export async function addConfessionToDb(conf) {
  try {
    const colRef = collection(db, 'confessions')
    await addDoc(colRef, {
      ...conf,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to post confession:', err)
    throw err
  }
}

export async function reactConfessionInDb(id, currentReactions) {
  try {
    const docRef = doc(db, 'confessions', id)
    await updateDoc(docRef, {
      reactions: (currentReactions || 0) + 1,
    })
  } catch (err) {
    console.error('Failed to react to confession:', err)
    throw err
  }
}

export async function updateConfessionStatusInDb(id, status) {
  try {
    const docRef = doc(db, 'confessions', id)
    await updateDoc(docRef, { status })
  } catch (err) {
    console.error('Failed to update confession status:', err)
    throw err
  }
}

export async function deleteConfessionFromDb(id) {
  try {
    const docRef = doc(db, 'confessions', id)
    await deleteDoc(docRef)
  } catch (err) {
    console.error('Failed to delete confession:', err)
    throw err
  }
}

// 6. Campus Wire Events
export function subscribeEvents(callback) {
  try {
    const colRef = collection(db, 'events')
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore events sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeEvents error:', err)
    return () => {}
  }
}

export async function addEventToDb(event) {
  try {
    const colRef = collection(db, 'events')
    await addDoc(colRef, {
      ...event,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to add campus event:', err)
    throw err
  }
}

export async function updateEventStatusInDb(id, status) {
  try {
    const docRef = doc(db, 'events', id)
    await updateDoc(docRef, { status })
  } catch (err) {
    console.error('Failed to update event status:', err)
    throw err
  }
}

export async function deleteEventFromDb(id) {
  try {
    const docRef = doc(db, 'events', id)
    await deleteDoc(docRef)
  } catch (err) {
    console.error('Failed to delete event:', err)
    throw err
  }
}

// 7. Lost & Found
export function subscribeLostAndFound(callback) {
  try {
    const colRef = collection(db, 'lost_and_found')
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore lost_and_found sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeLostAndFound error:', err)
    return () => {}
  }
}

export async function addLostAndFoundToDb(item) {
  try {
    const colRef = collection(db, 'lost_and_found')
    await addDoc(colRef, {
      ...item,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to add lost and found item:', err)
    throw err
  }
}

export async function toggleClaimLostAndFoundInDb(id, currentClaimed) {
  try {
    const docRef = doc(db, 'lost_and_found', id)
    await updateDoc(docRef, { claimed: !currentClaimed })
  } catch (err) {
    console.error('Failed to toggle claim:', err)
    throw err
  }
}

// 8. Auditions
export function subscribeAuditions(callback) {
  try {
    const colRef = collection(db, 'auditions')
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore auditions sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeAuditions error:', err)
    return () => {}
  }
}

export async function addAuditionToDb(aud) {
  try {
    const colRef = collection(db, 'auditions')
    await addDoc(colRef, {
      ...aud,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to submit audition:', err)
    throw err
  }
}

export async function updateAuditionStatusInDb(id, status) {
  try {
    const docRef = doc(db, 'auditions', id)
    await updateDoc(docRef, { status })
  } catch (err) {
    console.error('Failed to update audition status:', err)
    throw err
  }
}

// 9. Music Submissions
export function subscribeMusicSubmissions(callback) {
  try {
    const colRef = collection(db, 'music_submissions')
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          callback(list)
        }
      },
      (err) => {
        console.warn('Firestore music_submissions sync notice:', err.message)
      }
    )
  } catch (err) {
    console.warn('subscribeMusicSubmissions error:', err)
    return () => {}
  }
}

export async function submitMusicToDb(music) {
  try {
    const colRef = collection(db, 'music_submissions')
    await addDoc(colRef, {
      ...music,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    console.error('Failed to submit music:', err)
    throw err
  }
}

// Seeder Utility: Seeds complete campus radio data into Firestore
export async function seedCampusDataToFirestore() {
  console.log('Seeding campus data to Firestore...')
  try {
    // 1. Radio state
    await setDoc(doc(db, 'radio_state', 'live'), INITIAL_RADIO_STATE)

    // 2. Chat messages
    for (const msg of LIVE_CHAT_MESSAGES) {
      await setDoc(doc(db, 'chat_messages', msg.id), {
        ...msg,
        createdAt: serverTimestamp(),
      })
    }

    // 3. Song requests
    for (const req of SONG_REQUESTS) {
      await setDoc(doc(db, 'song_requests', req.id), {
        ...req,
        createdAt: serverTimestamp(),
      })
    }

    // 4. Polls
    for (const poll of CAMPUS_POLLS) {
      await setDoc(doc(db, 'polls', poll.id), poll)
    }

    // 5. Confessions
    for (const conf of CONFESSIONS) {
      await setDoc(doc(db, 'confessions', conf.id), {
        ...conf,
        createdAt: serverTimestamp(),
      })
    }

    // 6. Events
    for (const ev of CAMPUS_EVENTS) {
      await setDoc(doc(db, 'events', ev.id), {
        ...ev,
        createdAt: serverTimestamp(),
      })
    }

    // 7. Lost and found
    for (const lf of LOST_AND_FOUND) {
      await setDoc(doc(db, 'lost_and_found', lf.id), {
        ...lf,
        createdAt: serverTimestamp(),
      })
    }

    // 8. Auditions
    for (const aud of AUDITION_APPLICATIONS) {
      await setDoc(doc(db, 'auditions', aud.id), {
        ...aud,
        createdAt: serverTimestamp(),
      })
    }

    console.log('Campus data successfully seeded into Firestore!')
    return { success: true }
  } catch (err) {
    console.error('Error seeding data to Firestore:', err)
    return { success: false, error: err.message }
  }
}
