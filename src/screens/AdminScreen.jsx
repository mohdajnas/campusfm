import React, { useState } from 'react'
import confetti from 'canvas-confetti'
import { seedCampusDataToFirestore } from '../firebase/db'
import { fetchBestMatch } from '../services/musicService'

export function AdminScreen({
  radioState,
  onUpdateRadioState,
  shows,
  onUpdateShows,
  songRequests,
  onUpdateSongRequests,
  confessions,
  onUpdateConfessions,
  events = [],
  onAddEvent,
  onApproveEvent,
  onRejectEvent,
  lostAndFound,
  onUpdateLostAndFound,
  auditions,
  onUpdateAuditions,
  musicSubmissions,
  queue = [],
  onPlayTrack,
  onQueueTrack,
  onRemoveFromQueue,
  onSkipNext,
  onExitAdmin,
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('studio') // 'studio' | 'moderation' | 'wire' | 'auditions'
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState('')

  // Studio form state
  const [showTitle, setShowTitle] = useState(radioState?.currentShow?.title || '')
  const [showRj, setShowRj] = useState(radioState?.currentShow?.rj || '')
  const [trackTitle, setTrackTitle] = useState(radioState?.currentShow?.nowPlaying?.title || '')
  const [trackArtist, setTrackArtist] = useState(radioState?.currentShow?.nowPlaying?.artist || '')
  const [listeners, setListeners] = useState(radioState?.listenersCount || 428)
  const [isLive, setIsLive] = useState(radioState?.isLive ?? true)

  // Emergency alert state
  const [alertActive, setAlertActive] = useState(radioState?.emergencyAlert?.active ?? true)
  const [alertTitle, setAlertTitle] = useState(radioState?.emergencyAlert?.title || '')
  const [alertDetails, setAlertDetails] = useState(radioState?.emergencyAlert?.details || '')

  // New Event form
  const [evTitle, setEvTitle] = useState('')
  const [evClub, setEvClub] = useState('')
  const [evDate, setEvDate] = useState('')
  const [evVenue, setEvVenue] = useState('')
  const [evDesc, setEvDesc] = useState('')

  // Seeding trigger
  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    setSeedStatus('Seeding sample data to Cloud Firestore...')
    const res = await seedCampusDataToFirestore()
    setIsSeeding(false)
    if (res.success) {
      setSeedStatus('Successfully seeded Cloud Firestore (mescefm)!')
      confetti({ particleCount: 40, spread: 70 })
      setTimeout(() => setSeedStatus(''), 4000)
    } else {
      setSeedStatus(`Note: ${res.error}`)
    }
  }

  // Handle saving studio live broadcast state
  const handleSaveStudio = (e) => {
    e.preventDefault()
    onUpdateRadioState({
      ...radioState,
      isLive,
      listenersCount: parseInt(listeners) || 428,
      emergencyAlert: {
        ...radioState.emergencyAlert,
        active: alertActive,
        title: alertTitle,
        details: alertDetails,
        timestamp: 'Just updated by Admin',
      },
      currentShow: {
        ...radioState.currentShow,
        title: showTitle,
        rj: showRj,
        nowPlaying: {
          ...radioState.currentShow?.nowPlaying,
          title: trackTitle,
          artist: trackArtist,
        },
      },
    })
    confetti({ particleCount: 30, spread: 50 })
    alert('Studio Broadcast updated live on air and synced to Firestore!')
  }

  // Song request status change
  const handleUpdateRequestStatus = (id, newStatus) => {
    onUpdateSongRequests(
      songRequests.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
  }

  // Play song request immediately on air
  const handlePlayRequestNow = async (req) => {
    let track = null
    if (req.streamUrl) {
      track = req
    } else {
      const match = await fetchBestMatch(req.songTitle, req.artist)
      track = {
        ...match,
        id: req.id,
        title: req.songTitle || match.title,
        artist: req.artist || match.artist,
      }
    }

    if (onPlayTrack) {
      onPlayTrack({
        ...track,
        dedication: {
          requester: req.requester,
          to: req.dedicationTo,
          message: req.message,
        },
      })
    }
    handleUpdateRequestStatus(req.id, 'Now Playing')
    confetti({ particleCount: 30, spread: 50 })
  }

  // Queue song request right after current song
  const handleQueueRequestNext = async (req) => {
    let track = null
    if (req.streamUrl) {
      track = req
    } else {
      const match = await fetchBestMatch(req.songTitle, req.artist)
      track = {
        ...match,
        id: req.id,
        title: req.songTitle || match.title,
        artist: req.artist || match.artist,
      }
    }

    if (onQueueTrack) {
      onQueueTrack({
        ...track,
        dedication: {
          requester: req.requester,
          to: req.dedicationTo,
          message: req.message,
        },
      })
    }
    handleUpdateRequestStatus(req.id, 'Playing Soon')
    confetti({ particleCount: 20, spread: 40 })
  }

  // Delete song request
  const handleDeleteRequest = (id) => {
    onUpdateSongRequests(songRequests.filter((r) => r.id !== id))
  }

  // Confession approval/rejection
  const handleApproveConfession = (id) => {
    onUpdateConfessions(
      confessions.map((c) => (c.id === id ? { ...c, status: 'Approved', time: 'Approved Just Now' } : c))
    )
    confetti({ particleCount: 20, spread: 40 })
  }

  const handleRejectConfession = (id) => {
    onUpdateConfessions(confessions.filter((c) => c.id !== id))
  }

  // Lost & Found claim toggle
  const handleToggleClaimed = (id) => {
    onUpdateLostAndFound(
      lostAndFound.map((l) => (l.id === id ? { ...l, claimed: !l.claimed } : l))
    )
  }

  // Audition status update
  const handleAuditionStatus = (id, status) => {
    onUpdateAuditions(
      auditions.map((a) => (a.id === id ? { ...a, status } : a))
    )
  }

  // Add event handler
  const handleCreateEvent = (e) => {
    e.preventDefault()
    if (!evTitle.trim()) return

    onAddEvent({
      id: `ev-${Date.now()}`,
      title: evTitle.trim(),
      club: evClub.trim() || 'College Society',
      date: evDate.trim() || 'Upcoming',
      venue: evVenue.trim() || 'College Campus',
      desc: evDesc.trim() || 'Official college event announcement.',
      badge: 'CLUB EVENT',
      badgeColor: 'bg-[#ff7a00] text-white',
      status: 'approved',
      submittedBy: 'Studio Admin',
    })

    confetti({ particleCount: 25, spread: 50 })
    setEvTitle('')
    setEvClub('')
    setEvDate('')
    setEvVenue('')
    setEvDesc('')
    alert('New campus event published successfully!')
  }

  // Event approval/rejection handlers
  const handleApprove = (id) => {
    if (onApproveEvent) {
      onApproveEvent(id)
      confetti({ particleCount: 30, spread: 60 })
    }
  }

  const handleReject = (id) => {
    if (onRejectEvent) {
      onRejectEvent(id)
    }
  }

  const pendingEvents = (events || []).filter((e) => e.status === 'pending')
  const approvedEvents = (events || []).filter((e) => e.status !== 'pending')

  const pendingRequestsCount = songRequests.filter((r) => r.status === 'Pending').length
  const pendingConfessionsCount = confessions.filter((c) => c.status === 'Pending').length

  const adminTabs = [
    { id: 'studio', label: 'Studio Control', icon: 'settings_input_antenna' },
    { id: 'moderation', label: 'Moderation Queue', icon: 'gavel', badge: (pendingRequestsCount + pendingConfessionsCount) || null },
    { id: 'wire', label: 'Wire & Events', icon: 'campaign', badge: pendingEvents.length || null },
    { id: 'auditions', label: 'RJ Auditions', icon: 'mic' },
  ]

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Admin Top Master Header */}
      <div className="px-4 pt-2">
        <div className="bg-[#1c1c1e] text-white p-4.5 rounded-[28px] shadow-2xl border border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00d26a] animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7a00]">
                MESCE FM 108.1 • STANDALONE STUDIO CONSOLE
              </span>
            </div>

            <button
              onClick={onExitAdmin}
              className="text-[11px] bg-[#242426] hover:bg-[#2c2c2e] px-2.5 py-1 rounded-full font-bold text-white/90 border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">logout</span>
              <span>Exit Studio</span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-black text-white leading-tight">
                Radio Studio Command
              </h2>
              <p className="text-[11px] text-white/50">
                Connected to Firebase Firestore (`mescefm`)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-white/90">
                {isLive ? 'ON AIR' : 'OFFLINE'}
              </span>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                  isLive ? 'bg-[#ff7a00]' : 'bg-[#2c2c2e] border border-white/10'
                }`}
              >
                <span
                  className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                    isLive ? 'right-1' : 'left-1'
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Database Seeder Button */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-3 py-1.5 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white text-[11px] font-black rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[15px]">database</span>
              <span>{isSeeding ? 'Seeding Database...' : 'Seed / Sync Cloud Firestore'}</span>
            </button>

            {seedStatus && (
              <span className="text-[10px] text-[#ff7a00] font-bold animate-pulse">
                {seedStatus}
              </span>
            )}
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/[0.08] text-center">
            <div className="bg-[#242426] border border-white/5 p-2 rounded-xl">
              <span className="text-[15px] font-black text-white font-mono">{listeners}</span>
              <span className="text-[8.5px] text-white/40 block uppercase">Live</span>
            </div>
            <div className="bg-[#242426] border border-white/5 p-2 rounded-xl">
              <span className="text-[15px] font-black text-[#ff7a00] font-mono">
                {pendingRequestsCount}
              </span>
              <span className="text-[8.5px] text-white/40 block uppercase">Requests</span>
            </div>
            <div className="bg-[#242426] border border-white/5 p-2 rounded-xl">
              <span className="text-[15px] font-black text-[#00d26a] font-mono">
                {pendingConfessionsCount}
              </span>
              <span className="text-[8.5px] text-white/40 block uppercase">Confess</span>
            </div>
            <div className="bg-[#242426] border border-white/5 p-2 rounded-xl">
              <span className="text-[15px] font-black text-amber-400 font-mono">
                {pendingEvents.length}
              </span>
              <span className="text-[8.5px] text-white/40 block uppercase">Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Tab Selector */}
      <div className="px-4 mt-3">
        <div className="grid grid-cols-4 gap-1.5 bg-[#1c1c1e] border border-white/[0.08] p-1 rounded-2xl shadow-sm">
          {adminTabs.map((tab) => {
            const isActive = activeAdminTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`py-2 px-1 rounded-xl text-[10px] font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer relative ${
                  isActive
                    ? 'bg-[#ff7a00] text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#ff3b30] text-white text-[8px] font-black min-w-[14px] h-[14px] px-1 rounded-full flex items-center justify-center shadow">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-[65px]">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SECTION 1: Studio Live Controller */}
      {activeAdminTab === 'studio' && (
        <div className="px-4 mt-3 flex flex-col gap-3">
          {/* Live Audio Playback & Real-Time Queue Manager */}
          <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d26a] animate-pulse"></span>
                <h3 className="text-[14px] font-black text-white">On-Air Playback & Audio Queue</h3>
              </div>
              <button
                type="button"
                onClick={onSkipNext}
                className="px-2.5 py-1 bg-[#242426] hover:bg-[#2c2c2e] text-white rounded-xl text-[10px] font-bold border border-white/10 flex items-center gap-1 cursor-pointer active:scale-95 transition-all shadow-xs"
              >
                <span>Skip to Next</span>
                <span className="material-symbols-outlined text-[13px]">skip_next</span>
              </button>
            </div>

            {/* Currently Playing Card */}
            <div className="p-3 rounded-2xl bg-[#242426] border border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                {radioState.currentShow?.nowPlaying?.cover ? (
                  <img
                    src={radioState.currentShow.nowPlaying.cover}
                    alt="Current cover"
                    className="w-11 h-11 rounded-xl object-cover shadow-xs shrink-0"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                    }}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-[#ff7a00] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">music_note</span>
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase text-[#ff7a00] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a00] animate-ping"></span>
                    BROADCASTING LIVE
                  </span>
                  <h4 className="text-[13px] font-black text-white truncate">
                    {radioState.currentShow?.nowPlaying?.title || 'MESCE FM Track'}
                  </h4>
                  <p className="text-[10px] text-white/60 truncate">
                    {radioState.currentShow?.nowPlaying?.artist}
                    {radioState.currentShow?.nowPlaying?.dedication && (
                      <span className="text-[#ff7a00] font-bold ml-1">
                        • Dedicated to {radioState.currentShow.nowPlaying.dedication.to}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Queue List */}
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-white/70">
                <span>Up Next in Queue ({queue.length})</span>
                {queue.length > 0 && <span className="text-[#ff7a00]">Auto-plays after current song</span>}
              </div>

              {queue.length === 0 ? (
                <div className="p-3 rounded-2xl bg-[#242426] border border-white/10 text-center text-[11px] text-white/40">
                  Queue is empty. Station is rotating continuous curated Malayalam & campus hits.
                </div>
              ) : (
                queue.map((qTrack, qIdx) => (
                  <div
                    key={qTrack.id || qIdx}
                    className="p-2.5 rounded-2xl bg-[#242426] border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-[#2c2c2e] text-[#ff7a00] text-[10px] font-black flex items-center justify-center shrink-0 font-mono">
                        {qIdx + 1}
                      </span>
                      {qTrack.cover && (
                        <img
                          src={qTrack.cover}
                          alt={qTrack.title}
                          className="w-8 h-8 rounded-lg object-cover shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                          }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-[12px] font-black text-white truncate">{qTrack.title}</p>
                        <p className="text-[10px] text-white/50 truncate">
                          {qTrack.artist} {qTrack.dedication ? `(For ${qTrack.dedication.to})` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onPlayTrack && onPlayTrack(qTrack)}
                        className="px-2 py-1 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white rounded-lg text-[9px] font-bold cursor-pointer"
                        title="Broadcast immediately"
                      >
                        Play Now
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveFromQueue && onRemoveFromQueue(qIdx)}
                        className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 flex items-center justify-center text-[11px] cursor-pointer"
                        title="Remove from queue"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleSaveStudio} className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-[15px] font-black text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ff7a00] text-[20px]">
                  broadcast_on_home
                </span>
                Live Broadcast Parameters
              </h3>
              <span className="text-[10px] font-bold text-[#ff7a00]">108.1 FM</span>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/70 block mb-1">Current Show Title</label>
              <input
                type="text"
                value={showTitle}
                onChange={(e) => setShowTitle(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[13px] font-bold text-white outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/70 block mb-1">RJ / Hosts on Air</label>
              <input
                type="text"
                value={showRj}
                onChange={(e) => setShowRj(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Currently Playing Track</label>
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-bold text-white outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Artist / Band Name</label>
                <input
                  type="text"
                  value={trackArtist}
                  onChange={(e) => setTrackArtist(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/70 block mb-1">Live Campus Listeners Count</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={listeners}
                  onChange={(e) => setListeners(e.target.value)}
                  className="w-32 bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[13px] font-mono font-bold text-white outline-none focus:border-[#ff7a00]"
                />
                <button
                  type="button"
                  onClick={() => setListeners((prev) => parseInt(prev) + 25)}
                  className="px-2.5 py-1.5 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-lg text-xs font-bold cursor-pointer border border-white/5"
                >
                  +25
                </button>
                <button
                  type="button"
                  onClick={() => setListeners((prev) => Math.max(0, parseInt(prev) - 25))}
                  className="px-2.5 py-1.5 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-lg text-xs font-bold cursor-pointer border border-white/5"
                >
                  -25
                </button>
              </div>
            </div>

            {/* Emergency Banner Toggle */}
            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[12px] font-black text-white">Emergency Campus Notice</span>
                  <p className="text-[10px] text-white/50">High priority broadcast alert banner</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAlertActive(!alertActive)}
                  className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                    alertActive ? 'bg-[#ff3b30]' : 'bg-[#2c2c2e] border border-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                      alertActive ? 'right-1' : 'left-1'
                    }`}
                  ></span>
                </button>
              </div>

              {alertActive && (
                <div className="flex flex-col gap-2 bg-[#ff3b30]/10 p-3 rounded-2xl border border-[#ff3b30]/30">
                  <input
                    type="text"
                    value={alertTitle}
                    onChange={(e) => setAlertTitle(e.target.value)}
                    placeholder="Alert Title (e.g. CAMPUS NOTICE: Auditions Today)"
                    className="w-full bg-[#1c1c1e] border border-[#ff3b30]/40 rounded-xl px-3 py-1.5 text-[12px] font-bold text-white placeholder-white/40"
                  />
                  <textarea
                    rows="2"
                    value={alertDetails}
                    onChange={(e) => setAlertDetails(e.target.value)}
                    placeholder="Alert details text..."
                    className="w-full bg-[#1c1c1e] border border-[#ff3b30]/40 rounded-xl p-2 text-[11px] text-white placeholder-white/40"
                  ></textarea>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white font-black text-[13px] rounded-2xl shadow-lg transition-all cursor-pointer active:scale-98 mt-1"
            >
              Push Updates to Campus Broadcast & Firestore
            </button>
          </form>
        </div>
      )}

      {/* SECTION 2: Community Moderation Queue */}
      {activeAdminTab === 'moderation' && (
        <div className="px-4 mt-3 flex flex-col gap-4">
          {/* Song Requests Moderation */}
          <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="text-[14px] font-black text-white">Song Requests Queue</h3>
                <p className="text-[10px] text-white/50">Review and approve incoming dedications</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#242426] text-[#ff7a00] border border-white/10 text-[10px] font-bold">
                {songRequests.length} Total
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {songRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-[#242426] border border-white/10 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {req.cover ? (
                        <img
                          src={req.cover}
                          alt={req.songTitle}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-xs"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#ff7a00]/20 text-[#ff7a00] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[20px]">music_note</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[13px] font-black text-white truncate">{req.songTitle}</h4>
                        <p className="text-[11px] text-white/60 truncate">{req.artist}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        req.status === 'Now Playing'
                          ? 'bg-[#ff7a00]/20 text-[#ff7a00] border border-[#ff7a00]/30 animate-pulse'
                          : req.status === 'Queued (Up Next)' || req.status === 'Playing Soon'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : req.status === 'Approved'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#ff7a00] font-semibold">
                    From: {req.requester} ➔ Dedicated to: {req.dedicationTo}
                  </p>
                  <p className="text-[11px] text-white/70 italic">"{req.message}"</p>

                  <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => handlePlayRequestNow(req)}
                      className="px-2.5 py-1 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Broadcast immediately on air"
                    >
                      <span className="material-symbols-outlined text-[13px]">bolt</span>
                      <span>Play Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQueueRequestNext(req)}
                      className="px-2.5 py-1 bg-[#2c2c2e] hover:bg-[#38383a] text-white rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 border border-white/10"
                      title="Add to queue to play right after current track"
                    >
                      <span className="material-symbols-outlined text-[13px]">queue_music</span>
                      <span>Queue Next</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateRequestStatus(req.id, 'Approved')}
                      className="px-2.5 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRequest(req.id)}
                      className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-rose-400 border border-red-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confessions Moderation */}
          <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="text-[14px] font-black text-white">Confessions Moderation Wall</h3>
                <p className="text-[10px] text-white/50">Filter abusive or inappropriate submissions</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#242426] text-[#ff7a00] border border-white/10 text-[10px] font-bold">
                {confessions.length} Posts
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {confessions.map((conf) => (
                <div
                  key={conf.id}
                  className="p-3.5 rounded-2xl bg-[#242426] border border-white/10 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#2c2c2e] text-[#ff7a00] border border-white/10">
                      {conf.tag}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        conf.status === 'Approved'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {conf.status || 'Approved'}
                    </span>
                  </div>

                  <p className="text-[12px] text-white/90 leading-relaxed">
                    "{conf.content}"
                  </p>

                  <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/[0.08]">
                    {conf.status === 'Pending' && (
                      <button
                        onClick={() => handleApproveConfession(conf.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Approve & Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleRejectConfession(conf.id)}
                      className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Reject / Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Campus Wire Publisher */}
      {activeAdminTab === 'wire' && (
        <div className="px-4 mt-3 flex flex-col gap-4">
          {/* Student Submissions Moderation Queue */}
          <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="text-[14px] font-black text-white flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-[20px]">
                    pending_actions
                  </span>
                  Student Event Submissions
                </h3>
                <p className="text-[10px] text-white/50">
                  Events submitted by students requiring review before broadcasting
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                pendingEvents.length > 0 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-[#242426] text-white/40 border-white/10'
              }`}>
                {pendingEvents.length} Pending
              </span>
            </div>

            {pendingEvents.length === 0 ? (
              <div className="text-center py-5 px-4 bg-[#242426] rounded-2xl border border-dashed border-white/10">
                <span className="material-symbols-outlined text-[30px] text-white/40">
                  task_alt
                </span>
                <p className="text-[12px] font-bold text-white mt-1">All events reviewed!</p>
                <p className="text-[10px] text-white/50">
                  New student event proposals from Campus Wire will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl bg-[#242426] border border-amber-500/40 flex flex-col gap-2.5 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-500 text-black">
                            AWAITING APPROVAL
                          </span>
                          <span className="text-[10px] text-amber-300 font-bold">
                            By {ev.submittedBy || 'Student'}
                          </span>
                        </div>
                        <h4 className="text-[14px] font-black text-white mt-1 leading-snug">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-[#ff7a00] font-bold">{ev.club}</p>
                      </div>
                    </div>

                    {ev.desc && (
                      <p className="text-[11px] text-white/70 leading-relaxed bg-[#1c1c1e] p-2 rounded-xl border border-white/10">
                        {ev.desc}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-white/60">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-amber-400">calendar_today</span>
                        {ev.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-amber-400">location_on</span>
                        {ev.venue}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
                      <button
                        onClick={() => handleReject(ev.id)}
                        className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-[11px] font-bold rounded-xl cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(ev.id)}
                        className="px-3.5 py-1.5 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white text-[11px] font-extrabold rounded-xl shadow-sm cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Approve & Broadcast</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Live Published Events */}
          {approvedEvents.length > 0 && (
            <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                <div>
                  <h3 className="text-[14px] font-black text-white flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#ff7a00] text-[20px]">
                      event_available
                    </span>
                    Live Published Events ({approvedEvents.length})
                  </h3>
                  <p className="text-[10px] text-white/50">
                    Events currently visible to all students on Campus Wire
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {approvedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-[#242426] border border-white/10 flex items-center justify-between text-[12px]"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-extrabold text-white block truncate">{ev.title}</span>
                      <span className="text-[10px] text-white/50 truncate block">
                        {ev.club} • {ev.date} • {ev.venue}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReject(ev.id)}
                      title="Remove event from Campus Wire"
                      className="p-1.5 text-white/40 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Event Form */}
          <form onSubmit={handleCreateEvent} className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-[14px] font-black text-white flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ff7a00] text-[20px]">
                  add_circle
                </span>
                Publish New Fest or Club Event
              </h3>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/70 block mb-1">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Nakshatra 2026 / Hack-MES / Robo-Wars"
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] font-bold text-white outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Organizing Club</label>
                <input
                  type="text"
                  placeholder="e.g. IEEE / IEDC / Arts Club"
                  value={evClub}
                  onChange={(e) => setEvClub(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 block mb-1">Dates</label>
                <input
                  type="text"
                  placeholder="e.g. Nov 12 – 14, 2026"
                  value={evDate}
                  onChange={(e) => setEvDate(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/70 block mb-1">Venue on Campus</label>
              <input
                type="text"
                placeholder="e.g. Main Auditorium / Civil Seminar Hall"
                value={evVenue}
                onChange={(e) => setEvVenue(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-white/70 block mb-1">Short Description</label>
              <textarea
                rows="2"
                placeholder="Details, competitions, registration links..."
                value={evDesc}
                onChange={(e) => setEvDesc(e.target.value)}
                className="w-full bg-[#242426] border border-white/10 rounded-xl p-2.5 text-[12px] text-white outline-none focus:border-[#ff7a00]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white font-extrabold text-[12px] rounded-xl shadow-md cursor-pointer transition-all active:scale-98"
            >
              Broadcast on Campus Wire & Radio
            </button>
          </form>

          {/* Manage Lost & Found items */}
          <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-2.5">
            <h3 className="text-[14px] font-black text-white">Lost & Found Item Status</h3>
            <div className="flex flex-col gap-2">
              {lostAndFound.map((lf) => (
                <div
                  key={lf.id}
                  className="p-2.5 rounded-xl bg-[#242426] border border-white/10 flex items-center justify-between text-[12px]"
                >
                  <div className="min-w-0 pr-2">
                    <span className="font-extrabold text-white block truncate">{lf.item}</span>
                    <span className="text-[10px] text-white/50 truncate">{lf.location}</span>
                  </div>
                  <button
                    onClick={() => handleToggleClaimed(lf.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all ${
                      lf.claimed
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {lf.claimed ? 'Mark Unclaimed' : 'Mark Claimed'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: RJ Auditions & Guest Hosts */}
      {activeAdminTab === 'auditions' && (
        <div className="px-4 mt-3 flex flex-col gap-3">
          <div className="bg-[#1c1c1e] p-4.5 rounded-[28px] border border-white/[0.08] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div>
                <h3 className="text-[14px] font-black text-white">RJ Auditions & Applications</h3>
                <p className="text-[10px] text-white/50">Students applying for radio shows and guest hosting</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#242426] text-[#ff7a00] border border-white/10 text-[10px] font-bold">
                {auditions.length} Applications
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {auditions.map((aud) => (
                <div
                  key={aud.id}
                  className="p-3.5 rounded-2xl bg-[#242426] border border-white/10 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[13px] font-black text-white">
                        {aud.applicantName}
                      </h4>
                      <p className="text-[11px] text-[#ff7a00] font-bold">{aud.dept}</p>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                        aud.status.includes('Approved')
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {aud.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-white/80 font-medium leading-snug">
                    <span className="font-bold text-white/50">Show Pitch:</span> {aud.showConcept}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span>Preferred: {aud.preferredTime}</span>
                    <span className="font-semibold text-[#ff7a00]">🎵 {aud.sampleVoiceClip}</span>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-1.5 border-t border-white/[0.08]">
                    <button
                      onClick={() => handleAuditionStatus(aud.id, 'Approved for Pilot')}
                      className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Approve for Pilot
                    </button>
                    <button
                      onClick={() => handleAuditionStatus(aud.id, 'Interview Scheduled')}
                      className="px-2.5 py-1 bg-[#ff7a00] hover:bg-[#ff8c1a] text-white rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Schedule Audition
                    </button>
                    <button
                      onClick={() => handleAuditionStatus(aud.id, 'Declined')}
                      className="px-2 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
