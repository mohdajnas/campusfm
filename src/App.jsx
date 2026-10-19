import React, { useState, useEffect, useRef } from 'react'
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
  STUDENT_SPOTLIGHT,
  PLAYLISTS,
  AUDITION_APPLICATIONS,
} from './data/campusRadioData'
import {
  subscribeRadioState,
  updateRadioStateInDb,
  subscribeChatMessages,
  sendChatMessageToDb,
  subscribeSongRequests,
  addSongRequestToDb,
  updateSongRequestStatusInDb,
  deleteSongRequestFromDb,
  subscribePolls,
  votePollInDb,
  subscribeConfessions,
  addConfessionToDb,
  reactConfessionInDb,
  updateConfessionStatusInDb,
  deleteConfessionFromDb,
  subscribeEvents,
  addEventToDb,
  subscribeLostAndFound,
  addLostAndFoundToDb,
  toggleClaimLostAndFoundInDb,
  subscribeAuditions,
  addAuditionToDb,
  updateAuditionStatusInDb,
  subscribeMusicSubmissions,
  submitMusicToDb,
} from './firebase/db'
import { audioEngine } from './services/audioEngine'
import { Header } from './components/Header'
import { Navbar } from './components/Navbar'
import { MiniPlayer } from './components/MiniPlayer'
import { OnAirScreen } from './screens/OnAirScreen'
import { CommunityScreen } from './screens/CommunityScreen'
import { CampusWireScreen } from './screens/CampusWireScreen'
import { DiscoverScreen } from './screens/DiscoverScreen'
import { AdminScreen } from './screens/AdminScreen'
import { PlayerModal } from './screens/PlayerModal'
import { SleepTimerModal } from './components/SleepTimerModal'
import { EqualizerModal } from './components/EqualizerModal'
import { NotificationsModal } from './components/NotificationsModal'
import { ProfileModal } from './components/ProfileModal'
import { AuditionModal } from './components/AuditionModal'
import { AdminLoginModal } from './components/AdminLoginModal'

export default function App() {
  // Radio broadcast state
  const [radioState, setRadioState] = useState(INITIAL_RADIO_STATE)

  // Shows & Lineup
  const [shows, setShows] = useState(SHOWS)
  const [hosts] = useState(HOSTS)
  const [podcasts, setPodcasts] = useState(PODCASTS)

  // Community data state
  const [chatMessages, setChatMessages] = useState(LIVE_CHAT_MESSAGES)
  const [songRequests, setSongRequests] = useState(SONG_REQUESTS)
  const [polls, setPolls] = useState(CAMPUS_POLLS)
  const [confessions, setConfessions] = useState(CONFESSIONS)

  // Campus Wire state
  const [events, setEvents] = useState(CAMPUS_EVENTS)
  const [lostAndFound, setLostAndFound] = useState(LOST_AND_FOUND)
  const [opportunities] = useState(OPPORTUNITIES)

  // Discover state
  const [spotlight] = useState(STUDENT_SPOTLIGHT)
  const [playlists] = useState(PLAYLISTS)
  const [savedPlaylists, setSavedPlaylists] = useState(['pl-1'])
  const [musicSubmissions, setMusicSubmissions] = useState([])

  // Auditions state
  const [auditions, setAuditions] = useState(AUDITION_APPLICATIONS)

  // Navigation & audio state
  const [activeScreen, setActiveScreen] = useState('on-air')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFavorite, setIsFavorite] = useState(true)

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false)

  // Modals state
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false)
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuditionModalOpen, setIsAuditionModalOpen] = useState(false)
  const [sleepMinutes, setSleepMinutes] = useState(null)

  const sleepTimerRef = useRef(null)

  // Check URL parameters for standalone admin route (e.g. ?admin=true or #admin)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
      setIsAdminLoginModalOpen(true)
    }
  }, [])

  // 1. Subscribe to real-time Firestore collections
  useEffect(() => {
    const unsubRadio = subscribeRadioState((data) => {
      if (data) setRadioState(data)
    })
    const unsubChat = subscribeChatMessages((msgs) => {
      if (msgs && msgs.length > 0) setChatMessages(msgs)
    })
    const unsubRequests = subscribeSongRequests((reqs) => {
      if (reqs && reqs.length > 0) setSongRequests(reqs)
    })
    const unsubPolls = subscribePolls((p) => {
      if (p && p.length > 0) setPolls(p)
    })
    const unsubConf = subscribeConfessions((c) => {
      if (c && c.length > 0) setConfessions(c)
    })
    const unsubEvents = subscribeEvents((ev) => {
      if (ev && ev.length > 0) setEvents(ev)
    })
    const unsubLF = subscribeLostAndFound((lf) => {
      if (lf && lf.length > 0) setLostAndFound(lf)
    })
    const unsubAud = subscribeAuditions((aud) => {
      if (aud && aud.length > 0) setAuditions(aud)
    })
    const unsubMusic = subscribeMusicSubmissions((mus) => {
      if (mus && mus.length > 0) setMusicSubmissions(mus)
    })

    return () => {
      unsubRadio && unsubRadio()
      unsubChat && unsubChat()
      unsubRequests && unsubRequests()
      unsubPolls && unsubPolls()
      unsubConf && unsubConf()
      unsubEvents && unsubEvents()
      unsubLF && unsubLF()
      unsubAud && unsubAud()
      unsubMusic && unsubMusic()
    }
  }, [])

  // 2. Audio Engine Sync
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying)
    })
    return () => unsubscribe()
  }, [])

  // 3. Sleep Timer Countdown
  useEffect(() => {
    if (sleepMinutes && sleepMinutes > 0) {
      sleepTimerRef.current = setTimeout(() => {
        setSleepMinutes((prev) => {
          if (prev <= 1) {
            audioEngine.pause()
            return null
          }
          return prev - 1
        })
      }, 60000)
    } else {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current)
    }
    return () => {
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current)
    }
  }, [sleepMinutes])

  // Audio Playback Handlers
  const handleTogglePlay = () => {
    const currentStream = {
      id: 'mesce-fm',
      name: radioState.stationName,
      freqNum: 108.1,
      streamUrl: radioState.currentShow?.streamUrl || 'https://ice2.somafm.com/poptron-128-mp3',
    }
    audioEngine.togglePlay(currentStream)
  }

  const handlePlayPodcast = (podcast) => {
    audioEngine.playStation({
      id: podcast.id,
      name: podcast.title,
      freqNum: 108.1,
      streamUrl: podcast.streamUrl,
    })
    setRadioState((prev) => ({
      ...prev,
      currentShow: {
        ...prev.currentShow,
        title: podcast.title,
        rj: podcast.host,
        nowPlaying: {
          title: podcast.title,
          artist: podcast.host,
          album: 'MESCE FM Podcast Archive',
        },
      },
    }))
  }

  const handlePlayTrack = (track) => {
    audioEngine.playStation({
      id: 'student-track',
      name: track.title,
      freqNum: 108.1,
      streamUrl: 'https://ice2.somafm.com/groovesalad-128-mp3',
    })
    setRadioState((prev) => ({
      ...prev,
      currentShow: {
        ...prev.currentShow,
        nowPlaying: {
          title: track.title,
          artist: track.artist,
          album: track.album || 'Student Showcase',
        },
      },
    }))
  }

  // Real-time Community Handlers
  const handleSendMessage = async (msg) => {
    // Optimistic UI update
    setChatMessages((prev) => [...prev, { ...msg, id: `temp-${Date.now()}` }])
    try {
      await sendChatMessageToDb(msg)
    } catch {
      // Fallback local update already applied
    }
  }

  const handleAddSongRequest = async (req) => {
    setSongRequests((prev) => [{ ...req, id: `temp-${Date.now()}` }, ...prev])
    try {
      await addSongRequestToDb(req)
    } catch {
      // Local fallback
    }
  }

  const handleUpdateSongRequests = async (updatedList) => {
    setSongRequests(updatedList)
  }

  const handleVotePoll = async (pollId, optionId) => {
    const currentPoll = polls.find((p) => p.id === pollId)
    if (!currentPoll || currentPoll.userVoted) return

    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll
        return {
          ...poll,
          userVoted: optionId,
          totalVotes: poll.totalVotes + 1,
          options: poll.options.map((opt) =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          ),
        }
      })
    )

    try {
      await votePollInDb(pollId, optionId, currentPoll)
    } catch {
      // Local fallback
    }
  }

  const handleAddConfession = async (conf) => {
    setConfessions((prev) => [{ ...conf, id: `temp-${Date.now()}` }, ...prev])
    try {
      await addConfessionToDb(conf)
    } catch {
      // Local fallback
    }
  }

  const handleReactConfession = async (confId) => {
    const target = confessions.find((c) => c.id === confId)
    setConfessions((prev) =>
      prev.map((c) => (c.id === confId ? { ...c, reactions: c.reactions + 1 } : c))
    )
    if (target) {
      try {
        await reactConfessionInDb(confId, target.reactions)
      } catch {
        // Local fallback
      }
    }
  }

  const handleUpdateConfessions = async (updatedList) => {
    setConfessions(updatedList)
  }

  // Wire Handlers
  const handleAddLostFound = async (item) => {
    setLostAndFound((prev) => [{ ...item, id: `temp-${Date.now()}` }, ...prev])
    try {
      await addLostAndFoundToDb(item)
    } catch {
      // Local fallback
    }
  }

  const handleUpdateLostAndFound = async (updatedList) => {
    setLostAndFound(updatedList)
  }

  const handleAddEvent = async (event) => {
    setEvents((prev) => [event, ...prev])
    try {
      await addEventToDb(event)
    } catch {
      // Local fallback
    }
  }

  // Discover Handlers
  const handleSavePlaylist = (id) => {
    setSavedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSubmitMusic = async (track) => {
    setMusicSubmissions((prev) => [{ ...track, id: `temp-${Date.now()}` }, ...prev])
    try {
      await submitMusicToDb(track)
    } catch {
      // Local fallback
    }
  }

  // Auditions Handler
  const handleSubmitAudition = async (audition) => {
    setAuditions((prev) => [{ ...audition, id: `temp-${Date.now()}` }, ...prev])
    try {
      await addAuditionToDb(audition)
    } catch {
      // Local fallback
    }
  }

  const handleUpdateAuditions = async (updatedList) => {
    setAuditions(updatedList)
  }

  // Admin Broadcast State Update
  const handleUpdateRadioState = async (newState) => {
    setRadioState(newState)
    try {
      await updateRadioStateInDb(newState)
    } catch {
      // Local fallback
    }
  }

  // Admin Auth Handlers
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true)
    setActiveScreen('admin')
  }

  const handleExitAdmin = () => {
    setIsAdminAuthenticated(false)
    setActiveScreen('on-air')
    if (window.location.search.includes('admin') || window.location.hash.includes('admin')) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }

  return (
    <div className="bg-[#fdf8ff] text-[#1c163b] min-h-screen flex flex-col font-sans relative selection:bg-[#3814d4] selection:text-white">
      {/* Top Header (Clean student view without admin buttons) */}
      <Header
        currentScreen={activeScreen}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        isAdminActive={activeScreen === 'admin'}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-28 max-w-md mx-auto">
        {/* Screen 1: On Air */}
        {activeScreen === 'on-air' && (
          <OnAirScreen
            radioState={radioState}
            shows={shows}
            hosts={hosts}
            podcasts={podcasts}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onPlayPodcast={handlePlayPodcast}
            onOpenAuditionModal={() => setIsAuditionModalOpen(true)}
            onOpenRequestModal={() => setActiveScreen('community')}
          />
        )}

        {/* Screen 2: Community */}
        {activeScreen === 'community' && (
          <CommunityScreen
            chatMessages={chatMessages}
            onSendMessage={handleSendMessage}
            songRequests={songRequests}
            onAddSongRequest={handleAddSongRequest}
            polls={polls}
            onVotePoll={handleVotePoll}
            confessions={confessions}
            onAddConfession={handleAddConfession}
            onReactConfession={handleReactConfession}
          />
        )}

        {/* Screen 3: Campus Wire */}
        {activeScreen === 'wire' && (
          <CampusWireScreen
            events={events}
            lostAndFound={lostAndFound}
            opportunities={opportunities}
            alert={radioState?.emergencyAlert}
            onAddLostFound={handleAddLostFound}
          />
        )}

        {/* Screen 4: Discover */}
        {activeScreen === 'discover' && (
          <DiscoverScreen
            spotlight={spotlight}
            playlists={playlists}
            onPlayTrack={handlePlayTrack}
            onSavePlaylist={handleSavePlaylist}
            savedPlaylists={savedPlaylists}
            onSubmitMusic={handleSubmitMusic}
          />
        )}

        {/* Screen 5: Standalone Studio Admin (Accessible only via login) */}
        {activeScreen === 'admin' && isAdminAuthenticated && (
          <AdminScreen
            radioState={radioState}
            onUpdateRadioState={handleUpdateRadioState}
            shows={shows}
            onUpdateShows={setShows}
            songRequests={songRequests}
            onUpdateSongRequests={handleUpdateSongRequests}
            confessions={confessions}
            onUpdateConfessions={handleUpdateConfessions}
            events={events}
            onAddEvent={handleAddEvent}
            lostAndFound={lostAndFound}
            onUpdateLostAndFound={handleUpdateLostAndFound}
            auditions={auditions}
            onUpdateAuditions={handleUpdateAuditions}
            musicSubmissions={musicSubmissions}
            onExitAdmin={handleExitAdmin}
          />
        )}

        {/* Screen 6: Full Player Modal */}
        {activeScreen === 'player' && (
          <PlayerModal
            radioState={radioState}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onClose={() => setActiveScreen('on-air')}
            onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
            onOpenEqualizer={() => setIsEqualizerOpen(true)}
            onOpenRequestModal={() => setActiveScreen('community')}
            sleepMinutes={sleepMinutes}
          />
        )}
      </main>

      {/* Floating Docked Mini Player (Visible when not in full player modal or admin) */}
      {activeScreen !== 'player' && activeScreen !== 'admin' && (
        <div className="fixed bottom-16 left-0 right-0 z-30 pointer-events-none">
          <div className="pointer-events-auto">
            <MiniPlayer
              radioState={radioState}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onExpand={() => setActiveScreen('player')}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite(!isFavorite)}
            />
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar (Visible only for student views) */}
      {activeScreen !== 'admin' && (
        <Navbar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      )}

      {/* Interactive Modals */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        activeMinutes={sleepMinutes}
        onSetTimer={(mins) => setSleepMinutes(mins)}
      />

      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectStation={() => setActiveScreen('on-air')}
        stations={[]}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
      />

      <AuditionModal
        isOpen={isAuditionModalOpen}
        onClose={() => setIsAuditionModalOpen(false)}
        onSubmitAudition={handleSubmitAudition}
      />

      {/* Standalone Admin Login Gate */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  )
}
