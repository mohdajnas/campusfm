import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { searchSongs } from '../services/musicService'

export function CommunityScreen({
  chatMessages,
  onSendMessage,
  songRequests,
  onAddSongRequest,
  polls,
  onVotePoll,
  confessions,
  onAddConfession,
  onReactConfession,
  nowPlayingTitle,
  queue = [],
  onPlayNow,
}) {
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'requests' | 'polls' | 'confessions'
  const [chatInput, setChatInput] = useState('')
  const [chatSender, setChatSender] = useState('')
  const [isAnonChat, setIsAnonChat] = useState(false)

  // Request modal state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [reqSong, setReqSong] = useState('')
  const [reqArtist, setReqArtist] = useState('')
  const [reqName, setReqName] = useState('')
  const [reqDedication, setReqDedication] = useState('')
  const [reqMessage, setReqMessage] = useState('')
  const [isAnonReq, setIsAnonReq] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState(null)

  // Confession modal state
  const [isConfessionModalOpen, setIsConfessionModalOpen] = useState(false)
  const [confText, setConfText] = useState('')
  const [confTag, setConfTag] = useState('#Wholesome')

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const senderName = isAnonChat ? 'Anonymous Student' : (chatSender.trim() || 'MESCE Listener')
    onSendMessage({
      sender: senderName,
      text: chatInput.trim(),
      avatar: isAnonChat ? '🕵️' : '🎓',
      time: 'Just now',
    })
    setChatInput('')
  }

  const handleEmojiBurst = (emoji) => {
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.8 },
    })
    onSendMessage({
      sender: chatSender.trim() || 'Campus Listener',
      text: `${emoji} ${emoji} ${emoji}`,
      avatar: '⚡',
      time: 'Just now',
    })
  }

  // Live search effect for songs as user types
  useEffect(() => {
    if (!reqSong.trim() || reqSong.trim().length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      const query = reqArtist.trim() ? `${reqSong} ${reqArtist}` : reqSong
      const results = await searchSongs(query, 4)
      setSearchResults(results)
      setIsSearching(false)
    }, 350)

    return () => clearTimeout(timer)
  }, [reqSong, reqArtist])

  const handleSelectTrack = (track) => {
    setSelectedTrack(track)
    setReqSong(track.title)
    setReqArtist(track.artist)
    setSearchResults([])
  }

  const handleSubmitRequest = (e) => {
    e.preventDefault()
    if (!reqSong.trim()) return

    onAddSongRequest({
      songTitle: selectedTrack ? selectedTrack.title : reqSong.trim(),
      artist: selectedTrack ? selectedTrack.artist : (reqArtist.trim() || 'Campus Requested'),
      cover: selectedTrack?.cover,
      streamUrl: selectedTrack?.streamUrl,
      duration: selectedTrack?.duration || 30,
      requester: isAnonReq ? 'Anonymous Student' : (reqName.trim() || 'Campus Listener'),
      dedicationTo: reqDedication.trim() || 'Campus Friends',
      message: reqMessage.trim() || 'Play this track on MESCE FM!',
      status: 'Queued (Up Next)',
      timestamp: 'Just now',
    })

    confetti({ particleCount: 35, spread: 65 })
    setIsRequestModalOpen(false)
    setReqSong('')
    setReqArtist('')
    setReqDedication('')
    setReqMessage('')
    setSelectedTrack(null)
    setSearchResults([])
  }

  const handleSubmitConfession = (e) => {
    e.preventDefault()
    if (!confText.trim()) return

    onAddConfession({
      tag: confTag,
      content: confText.trim(),
      reactions: 1,
      time: 'Pending Admin Review',
      status: 'Pending',
    })

    confetti({ particleCount: 25, spread: 50 })
    setIsConfessionModalOpen(false)
    setConfText('')
    alert('Thank you! Your confession has been submitted to the Station Admin moderation queue and will be published once reviewed.')
  }

  const tabs = [
    { id: 'chat', label: 'Live Chat', icon: 'chat' },
    { id: 'requests', label: 'Song Requests', icon: 'queue_music' },
    { id: 'polls', label: 'Live Polls', icon: 'how_to_vote' },
    { id: 'confessions', label: 'Confessions', icon: 'sentiment_very_satisfied' },
  ]

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Top community navigation tabs */}
      <div className="px-4 pt-2 pb-2">
        <div className="grid grid-cols-4 gap-1.5 bg-[#f1ebff] p-1 rounded-2xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 rounded-xl text-[11px] font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#3814d4] text-white shadow-md'
                    : 'text-[#474556] hover:text-[#3814d4]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span className="truncate max-w-[70px]">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB 1: Live Chat */}
      {activeTab === 'chat' && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          {/* Header banner */}
          <div className="bg-[#f7f1ff] border border-[#e6deff] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00d26a] animate-pulse"></span>
              <span className="text-[12px] font-extrabold text-[#1c163b]">
                Live Moderated Show Chat
              </span>
            </div>
            <span className="text-[10px] text-[#474556] bg-white px-2 py-0.5 rounded-full font-bold">
              Host Active
            </span>
          </div>

          {/* Emoji Reaction Burst Bar */}
          <div className="flex items-center justify-around py-1.5 bg-white rounded-2xl border border-[#e6deff]/60 shadow-sm">
            {['🔥', '❤️', '⚡', '🎧', '🎂', '👏'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiBurst(emoji)}
                className="text-[20px] hover:scale-125 active:scale-95 transition-transform p-1 cursor-pointer"
                title={`Send ${emoji} burst`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#e6deff]/60 shadow-sm flex flex-col gap-2.5 max-h-[380px] overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-2xl flex items-start gap-2.5 ${
                  msg.isHost
                    ? 'bg-[#f1ebff] border border-[#c5c0ff]'
                    : 'bg-[#fdf8ff] border border-[#e6deff]/40'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-sm">
                  {msg.avatar || '🎓'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[12px] font-black truncate ${
                        msg.isHost ? 'text-[#3814d4]' : 'text-[#1c163b]'
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-[#777587] font-semibold">{msg.time}</span>
                  </div>
                  <p className="text-[12px] text-[#1c163b] leading-snug mt-0.5">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendChat} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={isAnonChat ? 'Posting anonymously...' : 'Your Name (e.g. Rahul S5 Mech)'}
                value={chatSender}
                onChange={(e) => setChatSender(e.target.value)}
                disabled={isAnonChat}
                className="flex-1 bg-white border border-[#e6deff] rounded-xl px-3 py-1.5 text-[12px] text-[#1c163b] placeholder:text-[#777587] outline-none focus:border-[#3814d4]"
              />
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#474556] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonChat}
                  onChange={(e) => setIsAnonChat(e.target.checked)}
                  className="rounded text-[#3814d4] accent-[#3814d4]"
                />
                <span>Anon</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Say something to the RJ & listeners..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white border border-[#e6deff] rounded-2xl px-4 py-2.5 text-[13px] text-[#1c163b] placeholder:text-[#777587] outline-none focus:border-[#3814d4] shadow-sm"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-2xl bg-[#3814d4] text-white flex items-center justify-center shrink-0 shadow-md hover:bg-[#2400a0] transition-colors cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Song Requests & Dedications */}
      {activeTab === 'requests' && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1c163b]">On-Air Song Requests</h3>
              <p className="text-[11px] text-[#474556]">Any requested song auto-queues to play next on air!</p>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-3.5 py-2 bg-[#3814d4] text-white text-[11px] font-extrabold rounded-full shadow-md flex items-center gap-1.5 hover:bg-[#2400a0] transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">queue_music</span>
              <span>Dedicate Song</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {songRequests.map((req, idx) => {
              const isCurrentlyPlaying = nowPlayingTitle && req.songTitle.toLowerCase().includes(nowPlayingTitle.toLowerCase().slice(0, 10))
              const isNextInQueue = queue.some((q) => q.title.toLowerCase().includes(req.songTitle.toLowerCase().slice(0, 10)))

              return (
                <div
                  key={req.id || idx}
                  className={`p-3.5 rounded-2xl bg-white border transition-all shadow-sm flex flex-col gap-2 ${
                    isCurrentlyPlaying
                      ? 'border-[#e40468] ring-2 ring-[#ffd9df] shadow-md'
                      : isNextInQueue
                      ? 'border-[#3814d4] ring-1 ring-[#e3dfff]'
                      : 'border-[#e6deff]/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {req.cover ? (
                        <img
                          src={req.cover}
                          alt={req.songTitle}
                          className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#3814d4] to-[#e40468] text-white flex items-center justify-center shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">music_note</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-black text-[#1c163b] truncate">
                          {req.songTitle}
                        </h4>
                        <p className="text-[11px] text-[#474556] truncate font-medium">{req.artist}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                        isCurrentlyPlaying
                          ? 'bg-[#ffd9df] text-[#e40468] animate-pulse'
                          : isNextInQueue
                          ? 'bg-[#e3dfff] text-[#140067]'
                          : req.status === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-[#f1ebff] text-[#474556]'
                      }`}
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e40468] animate-ping"></span>
                          <span>ON AIR NOW</span>
                        </>
                      ) : isNextInQueue ? (
                        <>
                          <span className="material-symbols-outlined text-[11px]">skip_next</span>
                          <span>UP NEXT</span>
                        </>
                      ) : (
                        req.status
                      )}
                    </span>
                  </div>

                  <div className="bg-[#fdf8ff] p-2.5 rounded-xl border border-[#e6deff]/40 text-[11px]">
                    <div className="flex items-center justify-between text-[#3814d4] font-bold mb-0.5">
                      <span>From: {req.requester}</span>
                      <span className="text-[#e40468]">To: {req.dedicationTo}</span>
                    </div>
                    <p className="text-[#474556] italic">"{req.message}"</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Campus Polls & Voting */}
      {activeTab === 'polls' && (
        <div className="px-4 mt-2 flex flex-col gap-4">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#1c163b]">Campus Opinion & Polls</h3>
            <p className="text-[11px] text-[#474556]">Your votes decide on-air topics and fest playlists</p>
          </div>

          <div className="flex flex-col gap-3.5">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="p-4 rounded-2xl bg-white border border-[#e6deff]/60 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[14px] font-black text-[#1c163b] leading-snug">
                    {poll.question}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#f1ebff] text-[#3814d4] shrink-0 font-mono">
                    {poll.totalVotes} votes
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {poll.options.map((opt) => {
                    const pct = Math.round((opt.votes / (poll.totalVotes || 1)) * 100)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => onVotePoll(poll.id, opt.id)}
                        className="relative overflow-hidden w-full p-3 rounded-xl border border-[#e6deff] bg-[#fdf8ff] hover:bg-[#f1ebff] transition-all text-left flex items-center justify-between cursor-pointer group"
                      >
                        {/* Fill progress bar */}
                        <div
                          className="absolute inset-0 bg-[#ebe5ff] transition-all duration-500 pointer-events-none group-hover:bg-[#e3dfff]"
                          style={{ width: `${pct}%` }}
                        ></div>

                        <span className="relative z-10 text-[12px] font-bold text-[#1c163b]">
                          {opt.label}
                        </span>
                        <span className="relative z-10 text-[12px] font-black text-[#3814d4] font-mono">
                          {pct}%
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Confessions of the Campus */}
      {activeTab === 'confessions' && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1c163b]">Campus Confessions Wall</h3>
              <p className="text-[11px] text-[#474556]">Wholesome, funny, and 100% anonymous</p>
            </div>
            <button
              onClick={() => setIsConfessionModalOpen(true)}
              className="px-3.5 py-2 bg-[#e40468] text-white text-[11px] font-extrabold rounded-full shadow-md flex items-center gap-1 hover:bg-[#b70051] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Confess</span>
            </button>
          </div>

          <div className="bg-[#fffbf0] border border-[#ffdea8] p-3 rounded-2xl flex items-center gap-2.5 text-[11px] text-[#5d4100]">
            <span className="material-symbols-outlined text-[18px] text-[#eaa800] shrink-0">
              shield
            </span>
            <span>All submissions are reviewed by Station Admins prior to publishing to keep our campus community safe & wholesome.</span>
          </div>

          <div className="flex flex-col gap-3">
            {confessions.map((conf) => (
              <div
                key={conf.id}
                className="p-4 rounded-2xl bg-white border border-[#e6deff]/60 shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f1ebff] text-[#3814d4]">
                    {conf.tag}
                  </span>
                  <span className="text-[10px] text-[#777587] font-semibold">{conf.time}</span>
                </div>

                <p className="text-[13px] text-[#1c163b] leading-relaxed">
                  "{conf.content}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-[#f1ebff]">
                  <span className="text-[10px] text-[#777587] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Approved by MESCE Radio Desk
                  </span>

                  <button
                    onClick={() => onReactConfession(conf.id)}
                    className="flex items-center gap-1 text-[12px] font-extrabold text-[#e40468] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      favorite
                    </span>
                    <span>{conf.reactions}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Dedicate a Song */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#3814d4] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">queue_music</span>
              </div>
              <div>
                <h3 className="text-[17px] font-black text-[#1c163b]">Request & Dedicate</h3>
                <p className="text-[11px] text-[#474556]">Hear your dedication live on 108.1 FM</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="flex flex-col gap-2.5 mt-1">
              {/* Song Title Search Input */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-[#474556]">Search Song Title *</label>
                  {isSearching && (
                    <span className="text-[10px] text-[#3814d4] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#3814d4] animate-ping"></span>
                      Searching...
                    </span>
                  )}
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Illuminati, Kuthanthram, Cherathukal, Avial..."
                    value={reqSong}
                    onChange={(e) => {
                      setReqSong(e.target.value)
                      if (selectedTrack && e.target.value !== selectedTrack.title) {
                        setSelectedTrack(null)
                      }
                    }}
                    className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl pl-8 pr-3 py-2 text-[13px] text-[#1c163b] font-bold outline-none focus:border-[#3814d4]"
                  />
                  <span className="material-symbols-outlined text-[16px] text-[#777587] absolute left-2.5 pointer-events-none">
                    search
                  </span>
                </div>

                {/* Instant Search Suggestions Dropdown */}
                {searchResults.length > 0 && !selectedTrack && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e6deff] rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider font-black text-[#777587] px-2 py-0.5">
                      Select Verified Playable Track:
                    </span>
                    {searchResults.map((track) => (
                      <button
                        type="button"
                        key={track.id}
                        onClick={() => handleSelectTrack(track)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#f1ebff] transition-all text-left cursor-pointer group"
                      >
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-8 h-8 rounded-lg object-cover shadow-xs shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-black text-[#1c163b] group-hover:text-[#3814d4] truncate">
                            {track.title}
                          </p>
                          <p className="text-[10px] text-[#777587] truncate">{track.artist}</p>
                        </div>
                        <span className="text-[10px] font-bold text-[#3814d4] px-2 py-0.5 rounded-full bg-[#e3dfff] shrink-0">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Track Preview Badge */}
              {selectedTrack && (
                <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#e3dfff] to-[#ffd9df] border border-[#3814d4]/30 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={selectedTrack.cover}
                      alt={selectedTrack.title}
                      className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#3814d4]">
                          check_circle
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#3814d4]">
                          Verified Stream Ready
                        </span>
                      </div>
                      <p className="text-[12px] font-black text-[#1c163b] truncate">
                        {selectedTrack.title}
                      </p>
                      <p className="text-[10px] text-[#474556] truncate font-medium">
                        {selectedTrack.artist} • {selectedTrack.album}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTrack(null)}
                    className="w-6 h-6 rounded-full bg-white/80 text-[#474556] hover:bg-white flex items-center justify-center shrink-0 cursor-pointer text-xs"
                    title="Change track"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Artist / Band</label>
                <input
                  type="text"
                  placeholder="e.g. Sushin Shyam / Dabzee / Coldplay"
                  value={reqArtist}
                  onChange={(e) => setReqArtist(e.target.value)}
                  className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#474556] block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder={isAnonReq ? 'Anonymous' : 'e.g. Rohit (S6 Mech)'}
                    disabled={isAnonReq}
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#474556] block mb-1">Dedicated To</label>
                  <input
                    type="text"
                    placeholder="e.g. Hostel Room 102"
                    value={reqDedication}
                    onChange={(e) => setReqDedication(e.target.value)}
                    className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] font-bold text-[#474556] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonReq}
                  onChange={(e) => setIsAnonReq(e.target.checked)}
                  className="rounded text-[#3814d4] accent-[#3814d4]"
                />
                <span>Request anonymously (keep my name hidden)</span>
              </label>

              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Shout-out Message</label>
                <textarea
                  rows="2"
                  placeholder="Write a message for the RJ to read live on air..."
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                ></textarea>
              </div>

              <div className="bg-[#fffbf0] border border-[#ffdea8] p-2.5 rounded-xl text-[10px] text-[#5d4100] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#e40468] shrink-0">
                  queue_music
                </span>
                <span>This song will be fetched and placed into the live radio queue right after the currently playing song!</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#3814d4] hover:bg-[#2400a0] text-white font-black text-[13px] shadow-md transition-all cursor-pointer mt-0.5 active:scale-98 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Queue Track (Plays Right After Current Song)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Drop a Confession */}
      {isConfessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setIsConfessionModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#e40468] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div>
                <h3 className="text-[17px] font-black text-[#1c163b]">Campus Confession</h3>
                <p className="text-[11px] text-[#474556]">100% Anonymous & Pre-moderated</p>
              </div>
            </div>

            <form onSubmit={handleSubmitConfession} className="flex flex-col gap-2.5 mt-1">
              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Select Category Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  {['#Wholesome', '#CanteenCrimes', '#HostelLife', '#CampusCrush', '#ExamStress'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setConfTag(t)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        confTag === t ? 'bg-[#e40468] text-white shadow-sm' : 'bg-[#f1ebff] text-[#474556]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Confession Text *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Share your wholesome memory, funny canteen story, or campus confession..."
                  value={confText}
                  onChange={(e) => setConfText(e.target.value)}
                  className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl p-3 text-[12px] text-[#1c163b] outline-none focus:border-[#e40468]"
                ></textarea>
              </div>

              <div className="text-[10px] text-[#777587] leading-tight">
                🛡️ Note: Hate speech, harassment, or naming faculty disrespectfully will be automatically filtered and rejected by admins.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#e40468] hover:bg-[#b70051] text-white font-extrabold text-[13px] shadow-md transition-all cursor-pointer mt-1 active:scale-98"
              >
                Submit Anonymously for Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
