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

  const renderAvatar = (avatar, sender, isHost) => {
    const isImageUrl = avatar && (avatar.startsWith('http') || avatar.startsWith('data:') || avatar.startsWith('/'))

    if (isImageUrl) {
      return (
        <div className="relative shrink-0">
          <img
            src={avatar}
            alt={sender}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 shadow-sm"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            }}
          />
          {isHost && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#ff7a00] ring-1 ring-[#1c1c1e] flex items-center justify-center text-[7px] text-black font-black">
              ★
            </span>
          )}
        </div>
      )
    }

    // Modern monogram avatar fallback with gradient and orange accent
    const initials = sender
      ? sender
          .replace(/\(.*?\)/g, '')
          .trim()
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase()
      : 'ME'

    return (
      <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-black text-[11px] shadow-sm ring-1 ring-white/10 ${
        isHost
          ? 'bg-[#ff7a00] text-black'
          : 'bg-gradient-to-tr from-[#2c2c2e] to-[#3a3a3c] text-[#ff7a00]'
      }`}>
        {initials || 'ME'}
      </div>
    )
  }

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const senderName = isAnonChat ? 'Anonymous Student' : (chatSender.trim() || 'MESCE Listener')
    const userAvatar = isAnonChat
      ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'

    onSendMessage({
      sender: senderName,
      text: chatInput.trim(),
      avatar: userAvatar,
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
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
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

  const communityBoxes = [
    {
      id: 'chat',
      title: 'Live Chat',
      subtitle: `${chatMessages.length} messages`,
      icon: 'chat',
      bgClass: 'bg-gradient-to-br from-[#9b67db] to-[#8652cb]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(150, 98, 213, 0.4)',
      count: chatMessages.length,
    },
    {
      id: 'requests',
      title: 'Song Requests',
      subtitle: `${songRequests.length} requests`,
      icon: 'queue_music',
      bgClass: 'bg-gradient-to-br from-[#53df6d] to-[#3ece58]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(79, 219, 106, 0.4)',
      count: songRequests.length,
    },
    {
      id: 'polls',
      title: 'Live Polls',
      subtitle: `${polls.length} polls active`,
      icon: 'how_to_vote',
      bgClass: 'bg-gradient-to-br from-[#9ebaa2] to-[#86a58d]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(157, 185, 163, 0.4)',
      count: polls.length,
    },
    {
      id: 'confessions',
      title: 'Confessions',
      subtitle: `${confessions.length} notes`,
      icon: 'sentiment_very_satisfied',
      bgClass: 'bg-gradient-to-br from-[#ff9575] to-[#f97350]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(255, 147, 115, 0.4)',
      count: confessions.length,
    },
  ]

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 2x2 Category Box Grid (iOS Shortcuts Style - exact same style as Campus Wire) */}
      <div className="px-4 pt-3 pb-2">
        <div className="grid grid-cols-2 gap-3">
          {communityBoxes.map((box) => {
            const isActive = activeTab === box.id
            return (
              <button
                key={box.id}
                onClick={() => setActiveTab(box.id)}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-[22px] text-left transition-all duration-200 cursor-pointer select-none overflow-hidden min-h-[104px] ${
                  box.bgClass
                } ${box.hoverClass} ${
                  isActive
                    ? 'ring-[3.5px] ring-white shadow-xl scale-[1.02]'
                    : 'opacity-80 hover:opacity-100 hover:scale-[1.01] shadow-md'
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 12px 24px -4px ${box.glowColor}, 0 6px 12px -2px rgba(0, 0, 0, 0.12)`
                    : '0 4px 14px 0 rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Top: Icon & Indicator */}
                <div className="flex items-start justify-between w-full">
                  <span className="material-symbols-outlined text-white text-[28px] drop-shadow-sm select-none">
                    {box.icon}
                  </span>
                  {isActive ? (
                    <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[13px] font-black">check</span>
                    </div>
                  ) : box.count > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-black/15 text-white/95 text-[10px] font-bold backdrop-blur-xs">
                      {box.count}
                    </span>
                  ) : null}
                </div>

                {/* Bottom: Title & Subtitle */}
                <div className="mt-3">
                  <h4 className="text-white text-[15px] sm:text-[16px] font-bold leading-tight drop-shadow-sm">
                    {box.title}
                  </h4>
                  <p className="text-white/80 text-[11px] font-medium leading-tight mt-0.5 truncate">
                    {box.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* TAB 1: Live Chat */}
      {activeTab === 'chat' && (
        <div className="px-4 mt-2 flex flex-col gap-3">
          {/* Header banner */}
          <div className="bg-[#242426] border border-white/10 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00d26a] animate-pulse"></span>
              <span className="text-[12px] font-extrabold text-white">
                Live Moderated Show Chat
              </span>
            </div>
            <span className="text-[10px] text-[#ff7a00] bg-[#1c1c1e] border border-white/5 px-2 py-0.5 rounded-full font-bold">
              Host Active
            </span>
          </div>

          {/* Emoji Reaction Burst Bar */}
          <div className="flex items-center justify-around py-1.5 bg-[#1c1c1e] rounded-2xl border border-white/[0.08] shadow-sm">
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
          <div className="bg-[#1c1c1e] rounded-[24px] p-3.5 border border-white/[0.08] shadow-md flex flex-col gap-2.5 max-h-[380px] overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-2xl flex items-start gap-2.5 ${
                  msg.isHost
                    ? 'bg-[#242426] border border-[#ff7a00]/30'
                    : 'bg-[#242426]/70 border border-white/5'
                }`}
              >
                {renderAvatar(msg.avatar, msg.sender, msg.isHost)}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[12px] font-black truncate ${
                        msg.isHost ? 'text-[#ff7a00]' : 'text-white'
                      }`}
                    >
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-white/40 font-semibold">{msg.time}</span>
                  </div>
                  <p className="text-[12px] text-white/90 leading-snug mt-0.5">{msg.text}</p>
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
                className="flex-1 bg-[#242426] border border-white/10 rounded-xl px-3 py-1.5 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-[#ff7a00]"
              />
              <label className="flex items-center gap-1.5 text-[11px] font-bold text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonChat}
                  onChange={(e) => setIsAnonChat(e.target.checked)}
                  className="rounded text-[#ff7a00] accent-[#ff7a00]"
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
                className="flex-1 bg-[#242426] border border-white/10 rounded-2xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/40 outline-none focus:border-[#ff7a00] shadow-sm"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-2xl bg-[#ff7a00] hover:bg-[#ff8c1a] text-black flex items-center justify-center shrink-0 shadow-md transition-colors cursor-pointer active:scale-95"
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
              <h3 className="text-[16px] font-extrabold text-neutral-900">On-Air Song Requests</h3>
              <p className="text-[11px] text-neutral-500">Any requested song auto-queues to play next on air!</p>
            </div>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-3.5 py-2 bg-[#ff7a00] hover:bg-[#ff8c1a] text-black text-[11px] font-extrabold rounded-full shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
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
                  className={`p-3.5 rounded-[24px] bg-[#1c1c1e] border transition-all shadow-md flex flex-col gap-2 ${
                    isCurrentlyPlaying
                      ? 'border-[#ff7a00] shadow-lg ring-1 ring-[#ff7a00]/30'
                      : isNextInQueue
                      ? 'border-white/20'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {req.cover ? (
                        <img
                          src={req.cover}
                          alt={req.songTitle}
                          className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0 border border-white/5"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                          }}
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#2c2c2e] text-[#ff7a00] border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-[20px]">music_note</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[14px] font-black text-white truncate">
                          {req.songTitle}
                        </h4>
                        <p className="text-[11px] text-[#ff7a00] truncate font-medium">{req.artist}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1 ${
                        isCurrentlyPlaying
                          ? 'bg-[#ff7a00] text-black font-extrabold animate-pulse'
                          : isNextInQueue
                          ? 'bg-[#2c2c2e] text-[#ff7a00] border border-white/10'
                          : req.status === 'Approved'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-[#242426] text-white/60'
                      }`}
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
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

                  <div className="bg-[#242426] p-2.5 rounded-xl border border-white/5 text-[11px]">
                    <div className="flex items-center justify-between text-white/80 font-bold mb-0.5">
                      <span>From: <strong className="text-white">{req.requester}</strong></span>
                      <span className="text-[#ff7a00]">To: {req.dedicationTo}</span>
                    </div>
                    <p className="text-white/60 italic">"{req.message}"</p>
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
            <h3 className="text-[16px] font-extrabold text-neutral-900">Campus Opinion & Polls</h3>
            <p className="text-[11px] text-neutral-500">Your votes decide on-air topics and fest playlists</p>
          </div>

          <div className="flex flex-col gap-3">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="p-4 rounded-[24px] bg-[#1c1c1e] border border-white/[0.08] shadow-md flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-[14px] font-black text-white leading-snug">
                    {poll.question}
                  </h4>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#2c2c2e] text-[#ff7a00] border border-white/5 shrink-0 font-mono">
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
                        className="relative overflow-hidden w-full p-3 rounded-xl border border-white/10 bg-[#242426] hover:bg-[#2c2c2e] transition-all text-left flex items-center justify-between cursor-pointer group"
                      >
                        {/* Fill progress bar */}
                        <div
                          className="absolute inset-0 bg-[#ff7a00]/20 transition-all duration-500 pointer-events-none group-hover:bg-[#ff7a00]/30"
                          style={{ width: `${pct}%` }}
                        ></div>

                        <span className="relative z-10 text-[12px] font-bold text-white">
                          {opt.label}
                        </span>
                        <span className="relative z-10 text-[12px] font-black text-[#ff7a00] font-mono">
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
              <h3 className="text-[16px] font-extrabold text-neutral-900">Campus Confessions Wall</h3>
              <p className="text-[11px] text-neutral-500">Wholesome, funny, and 100% anonymous</p>
            </div>
            <button
              onClick={() => setIsConfessionModalOpen(true)}
              className="px-3.5 py-2 bg-[#ff7a00] hover:bg-[#ff8c1a] text-black text-[11px] font-extrabold rounded-full shadow-md flex items-center gap-1 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Confess</span>
            </button>
          </div>

          <div className="bg-[#242426] border border-white/10 p-3 rounded-2xl flex items-center gap-2.5 text-[11px] text-white/70">
            <span className="material-symbols-outlined text-[18px] text-[#ff7a00] shrink-0">
              shield
            </span>
            <span>All submissions are reviewed by Station Admins prior to publishing to keep our campus community safe & wholesome.</span>
          </div>

          <div className="flex flex-col gap-3">
            {confessions.map((conf) => (
              <div
                key={conf.id}
                className="p-4 rounded-[24px] bg-[#1c1c1e] border border-white/[0.08] shadow-md flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#2c2c2e] text-[#ff7a00] border border-white/5">
                    {conf.tag}
                  </span>
                  <span className="text-[10px] text-white/40 font-semibold">{conf.time}</span>
                </div>

                <p className="text-[13px] text-white/90 leading-relaxed">
                  "{conf.content}"
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <span className="text-[10px] text-white/40 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#00d26a]">verified</span>
                    Approved by MESCE Radio Desk
                  </span>

                  <button
                    onClick={() => onReactConfession(conf.id)}
                    className="flex items-center gap-1 text-[12px] font-extrabold text-[#ff3b30] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1c1c1e] text-white border border-white/[0.08] rounded-[28px] p-6 shadow-2xl flex flex-col gap-3 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5 z-10"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#2c2c2e] border border-white/10 text-[#ff7a00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">queue_music</span>
              </div>
              <div>
                <h3 className="text-[17px] font-black text-white">Request & Dedicate</h3>
                <p className="text-[11px] text-white/60">Hear your dedication live on 108.1 FM</p>
              </div>
            </div>

            <form onSubmit={handleSubmitRequest} className="flex flex-col gap-2.5 mt-1">
              {/* Song Title Search Input */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-white/60">Search Song Title *</label>
                  {isSearching && (
                    <span className="text-[10px] text-[#ff7a00] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#ff7a00] animate-ping"></span>
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
                    className="w-full bg-[#242426] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-[13px] text-white font-bold outline-none focus:border-[#ff7a00]"
                  />
                  <span className="material-symbols-outlined text-[16px] text-white/40 absolute left-2.5 pointer-events-none">
                    search
                  </span>
                </div>

                {/* Instant Search Suggestions Dropdown */}
                {searchResults.length > 0 && !selectedTrack && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#242426] border border-white/10 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto p-1.5 flex flex-col gap-1">
                    <span className="text-[9px] uppercase tracking-wider font-black text-white/50 px-2 py-0.5">
                      Select Verified Playable Track:
                    </span>
                    {searchResults.map((track) => (
                      <button
                        type="button"
                        key={track.id}
                        onClick={() => handleSelectTrack(track)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#2c2c2e] transition-all text-left cursor-pointer group"
                      >
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-8 h-8 rounded-lg object-cover shadow-xs shrink-0 border border-white/5"
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-black text-white group-hover:text-[#ff7a00] truncate">
                            {track.title}
                          </p>
                          <p className="text-[10px] text-white/50 truncate">{track.artist}</p>
                        </div>
                        <span className="text-[10px] font-bold text-black px-2 py-0.5 rounded-full bg-[#ff7a00] shrink-0">
                          Select
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Track Preview Badge */}
              {selectedTrack && (
                <div className="p-2.5 rounded-2xl bg-[#242426] border border-[#ff7a00]/40 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={selectedTrack.cover}
                      alt={selectedTrack.title}
                      className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0 border border-white/5"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#00d26a]">
                          check_circle
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7a00]">
                          Verified Stream Ready
                        </span>
                      </div>
                      <p className="text-[12px] font-black text-white truncate">
                        {selectedTrack.title}
                      </p>
                      <p className="text-[10px] text-white/60 truncate font-medium">
                        {selectedTrack.artist} • {selectedTrack.album}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTrack(null)}
                    className="w-6 h-6 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center shrink-0 cursor-pointer text-xs"
                    title="Change track"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Artist / Band</label>
                <input
                  type="text"
                  placeholder="e.g. Sushin Shyam / Dabzee / Coldplay"
                  value={reqArtist}
                  onChange={(e) => setReqArtist(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder={isAnonReq ? 'Anonymous' : 'e.g. Rohit (S6 Mech)'}
                    disabled={isAnonReq}
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white/60 block mb-1">Dedicated To</label>
                  <input
                    type="text"
                    placeholder="e.g. Hostel Room 102"
                    value={reqDedication}
                    onChange={(e) => setReqDedication(e.target.value)}
                    className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-[11px] font-bold text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonReq}
                  onChange={(e) => setIsAnonReq(e.target.checked)}
                  className="rounded text-[#ff7a00] accent-[#ff7a00]"
                />
                <span>Request anonymously (keep my name hidden)</span>
              </label>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Shout-out Message</label>
                <textarea
                  rows="2"
                  placeholder="Write a message for the RJ to read live on air..."
                  value={reqMessage}
                  onChange={(e) => setReqMessage(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                ></textarea>
              </div>

              <div className="bg-[#242426] border border-white/10 p-2.5 rounded-xl text-[10px] text-white/70 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-[#ff7a00] shrink-0">
                  queue_music
                </span>
                <span>This song will be fetched and placed into the live radio queue right after the currently playing song!</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-black text-[13px] shadow-md transition-all cursor-pointer mt-0.5 active:scale-98 flex items-center justify-center gap-1.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1c1c1e] text-white border border-white/[0.08] rounded-[28px] p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setIsConfessionModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#2c2c2e] border border-white/10 text-[#ff7a00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div>
                <h3 className="text-[17px] font-black text-white">Campus Confession</h3>
                <p className="text-[11px] text-white/60">100% Anonymous & Pre-moderated</p>
              </div>
            </div>

            <form onSubmit={handleSubmitConfession} className="flex flex-col gap-2.5 mt-1">
              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Select Category Tag</label>
                <div className="flex flex-wrap gap-1.5">
                  {['#Wholesome', '#CanteenCrimes', '#HostelLife', '#CampusCrush', '#ExamStress'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setConfTag(t)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        confTag === t ? 'bg-[#ff7a00] text-black shadow-sm' : 'bg-[#242426] text-white/60 border border-white/5'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Confession Text *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Share your wholesome memory, funny canteen story, or campus confession..."
                  value={confText}
                  onChange={(e) => setConfText(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl p-3 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                ></textarea>
              </div>

              <div className="text-[10px] text-white/40 leading-tight">
                🛡️ Note: Hate speech, harassment, or naming faculty disrespectfully will be automatically filtered and rejected by admins.
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-extrabold text-[13px] shadow-md transition-all cursor-pointer mt-1 active:scale-98"
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
