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
  updateEventStatusInDb,
  deleteEventFromDb,
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
import { liveBroadcastService } from './services/liveBroadcastService'
import { fetchBestMatch } from './services/musicService'
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

function checkIsAdminRoute() {
  if (typeof window === 'undefined') return false
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '')
  const hash = window.location.hash.toLowerCase()
  const search = window.location.search.toLowerCase()
  return (
    path === '/admin' ||
    path.startsWith('/admin') ||
    hash === '#/admin' ||
    hash === '#admin' ||
    search.includes('admin=true')
  )
}

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
  const [activeScreen, setActiveScreen] = useState(() => (checkIsAdminRoute() ? 'admin' : 'on-air'))
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackQueue, setPlaybackQueue] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(212)
  const [isFavorite, setIsFavorite] = useState(true)

  // Live Studio Microphone / Voice Broadcast State
  const [liveMicBroadcast, setLiveMicBroadcast] = useState({
    isLive: false,
    speaker: '',
    show: '',
  })

  // Admin authentication state (Strictly /admin only)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(() => checkIsAdminRoute())

  // Modals state
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false)
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuditionModalOpen, setIsAuditionModalOpen] = useState(false)
  const [sleepMinutes, setSleepMinutes] = useState(null)

  const sleepTimerRef = useRef(null)

  // Strict route listener: /admin only activates for admin/RJ route
  useEffect(() => {
    const handleRouteCheck = () => {
      const isAdmin = checkIsAdminRoute()
      if (isAdmin) {
        setActiveScreen('admin')
      } else {
        setIsAdminAuthenticated(false)
        setIsAdminLoginModalOpen(false)
        setActiveScreen((prev) => (prev === 'admin' ? 'on-air' : prev))
      }
    }

    handleRouteCheck()
    window.addEventListener('popstate', handleRouteCheck)
    window.addEventListener('hashchange', handleRouteCheck)
    return () => {
      window.removeEventListener('popstate', handleRouteCheck)
      window.removeEventListener('hashchange', handleRouteCheck)
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

  // 1b. Subscribe to Real-Time RJ Live Microphone Speaking
  useEffect(() => {
    const unsubMic = liveBroadcastService.startListening((broadcastState) => {
      setLiveMicBroadcast(broadcastState)
    })
    return () => {
      if (unsubMic) unsubMic()
    }
  }, [])

  // 2. Audio Engine Sync (Queue, Track, Playback, Time)
  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((state) => {
      setIsPlaying(state.isPlaying)
      setPlaybackQueue(state.queue || [])
      setCurrentTime(state.currentTime || 0)
      setDuration(state.duration || 212)

      if (state.currentTrack) {
        setRadioState((prev) => ({
          ...prev,
          currentShow: {
            ...prev.currentShow,
            cover: state.currentTrack.cover || prev.currentShow?.cover,
            nowPlaying: {
              title: state.currentTrack.title,
              artist: state.currentTrack.artist,
              album: state.currentTrack.album || 'MESCE FM Campus Play',
              cover: state.currentTrack.cover,
              duration: state.currentTrack.duration,
              dedication: state.currentTrack.dedication || null,
            },
          },
          queue: state.queue || [],
        }))
      }
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
    audioEngine.togglePlay()
  }

  const handleSkipNext = () => {
    audioEngine.skipNext()
  }

  const handleSkipPrev = () => {
    audioEngine.skipPrev()
  }

  const handleSeek = (time) => {
    audioEngine.seek(time)
  }

  const handlePlaySpecificTrack = (track) => {
    audioEngine.playTrack(track)
  }

  const handlePlayPodcast = (podcast) => {
    audioEngine.playTrack({
      id: podcast.id,
      title: podcast.title,
      artist: podcast.host,
      album: 'MESCE FM Podcast Archive',
      cover: podcast.cover,
      streamUrl: podcast.streamUrl || 'https://ice2.somafm.com/groovesalad-128-mp3',
      duration: 1440,
    })
  }

  const handlePlayTrack = async (track) => {
    if (track.streamUrl && !track.streamUrl.includes('AudioPreview') && track.duration > 30) {
      audioEngine.playTrack(track)
      return
    }
    const resolved = await fetchBestMatch(track.title, track.artist)
    audioEngine.playTrack({
      ...resolved,
      id: track.id || resolved.id,
      title: track.title || resolved.title,
      artist: track.artist || resolved.artist,
      album: track.album || resolved.album,
      cover: track.cover || resolved.cover,
    })
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
    // 1. Resolve full playable track metadata and stream URL
    let resolved = null
    if (req.streamUrl && !req.streamUrl.includes('AudioPreview')) {
      resolved = {
        id: `req-${Date.now()}`,
        title: req.songTitle,
        artist: req.artist,
        cover: req.cover,
        streamUrl: req.streamUrl,
        duration: req.duration || 212,
      }
    } else {
      const match = await fetchBestMatch(req.songTitle, req.artist)
      resolved = {
        ...match,
        id: `req-${Date.now()}`,
        title: req.songTitle || match.title,
        artist: req.artist || match.artist,
      }
    }

    const enrichedRequest = {
      ...req,
      id: resolved.id,
      songTitle: resolved.title,
      artist: resolved.artist,
      cover: resolved.cover,
      streamUrl: resolved.streamUrl,
      duration: resolved.duration,
      status: 'Queued (Up Next)',
    }

    // 2. Add to audio engine queue right after current playing song with dedication!
    audioEngine.addToQueue(
      {
        ...resolved,
        dedication: {
          requester: req.requester,
          to: req.dedicationTo,
          message: req.message,
        },
      },
      true // playNext = true, so it plays right after the current playing song!
    )

    // 3. Save to state & Firestore
    setSongRequests((prev) => [enrichedRequest, ...prev])
    try {
      await addSongRequestToDb(enrichedRequest)
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
    const eventWithStatus = { ...event, status: 'approved', submittedBy: 'Admin' }
    setEvents((prev) => [eventWithStatus, ...prev])
    try {
      await addEventToDb(eventWithStatus)
    } catch {
      // Local fallback
    }
  }

  // Student submits an event (pending admin approval)
  const handleSubmitStudentEvent = async (event) => {
    const pendingEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      status: 'pending',
      submittedBy: event.submittedBy || 'Anonymous Student',
      badge: 'STUDENT SUBMISSION',
      badgeColor: 'bg-amber-500 text-white',
    }
    setEvents((prev) => [pendingEvent, ...prev])
    try {
      await addEventToDb(pendingEvent)
    } catch {
      // Local fallback
    }
  }

  // Admin approves a pending event
  const handleApproveEvent = async (id) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, status: 'approved' } : ev))
    )
    try {
      await updateEventStatusInDb(id, 'approved')
    } catch {
      // Local fallback
    }
  }

  // Admin rejects a pending event
  const handleRejectEvent = async (id) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id))
    try {
      await deleteEventFromDb(id)
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

  // Admin Auth Handlers (Strictly accessed via /admin)
  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true)
    setIsAdminLoginModalOpen(false)
    setActiveScreen('admin')
    if (!checkIsAdminRoute()) {
      try {
        window.history.pushState({}, document.title, '/admin')
      } catch {
        window.location.hash = '#/admin'
      }
    }
  }

  const handleExitAdmin = () => {
    setIsAdminAuthenticated(false)
    setIsAdminLoginModalOpen(false)
    setActiveScreen('on-air')
    try {
      window.history.pushState({}, document.title, '/')
    } catch {
      window.location.hash = ''
    }
  }

  return (
    <div className="bg-white text-neutral-900 min-h-screen flex flex-col font-sans relative selection:bg-[#ff7a00] selection:text-black">
      {/* Top Header (Clean student view; hidden on admin console) */}
      {activeScreen !== 'admin' && (
        <Header
          currentScreen={activeScreen}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {/* Student-Facing Live RJ Voice On-Air Floating Banner */}
      {activeScreen !== 'admin' && liveMicBroadcast?.isLive && (
        <aside
          aria-label="Live Voice Broadcast Alert"
          className="fixed top-14 left-0 right-0 z-40 px-4 max-w-md mx-auto pointer-events-none"
        >
          <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-3 rounded-2xl shadow-2xl flex items-center justify-between gap-2.5 border border-white/20 pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center shrink-0 animate-pulse">
                <span className="material-symbols-outlined text-[19px] text-white">mic</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                    RJ Speaking Live On-Air
                  </span>
                </div>
                <p className="text-[12px] font-black truncate text-white">
                  {liveMicBroadcast.speaker || 'Central Studio RJ'} is broadcasting live
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 bg-black/40 px-2.5 py-1 rounded-xl">
              <span className="w-1 h-3.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-1 h-5 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
              <span className="w-1 h-2.5 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Viewport */}
      <main
        className={
          activeScreen === 'admin'
            ? 'flex-1 flex flex-col relative w-full pb-10 max-w-md mx-auto'
            : 'flex-1 flex flex-col relative w-full pt-16 pb-28 max-w-md mx-auto'
        }
      >
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
            onSkipNext={handleSkipNext}
            onSkipPrev={handleSkipPrev}
            currentTime={currentTime}
            duration={duration}
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
            nowPlayingTitle={radioState.currentShow?.nowPlaying?.title}
            queue={playbackQueue}
            onPlayNow={handlePlaySpecificTrack}
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
            onSubmitEvent={handleSubmitStudentEvent}
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

        {/* Screen 5: Standalone Studio Admin (Strictly /admin only) */}
        {activeScreen === 'admin' &&
          (isAdminAuthenticated ? (
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
              onApproveEvent={handleApproveEvent}
              onRejectEvent={handleRejectEvent}
              lostAndFound={lostAndFound}
              onUpdateLostAndFound={handleUpdateLostAndFound}
              auditions={auditions}
              onUpdateAuditions={handleUpdateAuditions}
              musicSubmissions={musicSubmissions}
              queue={playbackQueue}
              onPlayTrack={handlePlaySpecificTrack}
              onQueueTrack={(track) => audioEngine.addToQueue(track, true)}
              onRemoveFromQueue={(idx) => audioEngine.removeFromQueue(idx)}
              onSkipNext={handleSkipNext}
              onExitAdmin={handleExitAdmin}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center my-auto min-h-[70vh]">
              <div className="w-16 h-16 rounded-3xl bg-[#1c1c1e] border border-white/10 text-[#ff7a00] flex items-center justify-center mb-4 shadow-xl">
                <span className="material-symbols-outlined text-[32px]">lock</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#ff7a00]/15 text-[#ff7a00] text-[11px] font-black uppercase tracking-wider mb-2 border border-[#ff7a00]/30">
                Restricted Station Area
              </span>
              <h2 className="text-xl font-black text-neutral-900">
                MESCE FM 108.1 Studio Console
              </h2>
              <p className="text-xs text-neutral-600 max-w-xs mt-1.5 leading-relaxed">
                This portal is reserved strictly for faculty station directors, technical crew, and
                student RJs on-air.
              </p>
              <div className="flex flex-col gap-2.5 mt-6 w-full max-w-xs">
                <button
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="w-full py-3 bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-extrabold text-[13px] rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  Sign In to Studio Console
                </button>
                <button
                  onClick={handleExitAdmin}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-2xl border border-neutral-200 transition-colors cursor-pointer"
                >
                  ← Back to Student Radio
                </button>
              </div>
            </div>
          ))}

        {/* Screen 6: Full Player Modal */}
        {activeScreen === 'player' && (
          <PlayerModal
            radioState={radioState}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onSkipNext={handleSkipNext}
            onSkipPrev={handleSkipPrev}
            queue={playbackQueue}
            onPlayTrack={handlePlaySpecificTrack}
            isFavorite={isFavorite}
            onToggleFavorite={() => setIsFavorite(!isFavorite)}
            onClose={() => setActiveScreen('on-air')}
            onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
            onOpenEqualizer={() => setIsEqualizerOpen(true)}
            onOpenRequestModal={() => setActiveScreen('community')}
            sleepMinutes={sleepMinutes}
            liveMicBroadcast={liveMicBroadcast}
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
              currentTime={currentTime}
              duration={duration}
              onTogglePlay={handleTogglePlay}
              onSkipNext={handleSkipNext}
              onExpand={() => setActiveScreen('player')}
              isFavorite={isFavorite}
              onToggleFavorite={() => setIsFavorite(!isFavorite)}
              liveMicBroadcast={liveMicBroadcast}
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
      />

      <AuditionModal
        isOpen={isAuditionModalOpen}
        onClose={() => setIsAuditionModalOpen(false)}
        onSubmitAudition={handleSubmitAudition}
      />

      {/* Standalone Admin Login Gate (Triggered strictly on /admin) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={handleExitAdmin}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  )
}
