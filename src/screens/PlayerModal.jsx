import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export function PlayerModal({
  radioState,
  isPlaying,
  currentTime = 0,
  duration = 212,
  onSeek,
  onSkipNext,
  onSkipPrev,
  queue = [],
  onPlayTrack,
  onTogglePlay,
  isFavorite,
  onToggleFavorite,
  onClose,
  onOpenSleepTimer,
  onOpenEqualizer,
  onOpenRequestModal,
  sleepMinutes,
  liveMicBroadcast,
}) {
  const [streamQuality, setStreamQuality] = useState('320k HD')
  const [trackLiked, setTrackLiked] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const currentShow = radioState?.currentShow
  const nowPlaying = currentShow?.nowPlaying
  const dedication = nowPlaying?.dedication

  // Format seconds into m:ss
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  const handleScrubberClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width))
    if (onSeek) {
      onSeek(newPercent * duration)
    }
  }

  const handleFavoriteWithConfetti = () => {
    onToggleFavorite()
    if (!isFavorite) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#e40468', '#3814d4', '#ffdea8'],
      })
    }
  }

  const handleShare = async () => {
    const text = dedication
      ? `Listening to "${nowPlaying?.title}" on MESCE FM 108.1 dedicated to ${dedication.to}!`
      : `Tune into MESCE FM 108.1: ${nowPlaying?.title} with ${currentShow?.rj}!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `MESCE FM 108.1 - ${nowPlaying?.title || currentShow?.title}`,
          text,
          url: window.location.href,
        })
      } catch {
        // Cancelled
      }
    } else {
      navigator.clipboard?.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
  }

  const handleToggleQuality = () => {
    const qualities = ['320k HD', '192k CD', '128k Data Saver']
    const nextIdx = (qualities.indexOf(streamQuality) + 1) % qualities.length
    setStreamQuality(qualities[nextIdx])
  }

  const nextQueuedTrack = queue.length > 0 ? queue[0] : null

  return (
    <div className="flex flex-col w-full px-4 pb-6 animate-fadeIn">
      {/* Full Screen Curved Modal Card */}
      <div className="w-full bg-[#1c1c1e] text-white rounded-[32px] shadow-[0_24px_64px_rgba(0,0,0,0.8)] border border-white/[0.08] flex flex-col items-center pt-3 pb-8 px-5 relative overflow-hidden">
        {/* Ambient Soundwave Glow Backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Drag / Pull Indicator & Sheet Top Bar */}
        <div className="w-10 h-1 bg-white/20 rounded-full mb-3"></div>

        <div className="w-full flex items-center justify-between mb-2 z-10">
          <button
            onClick={onClose}
            aria-label="Minimize player"
            className="w-10 h-10 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-transform active:scale-90 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="text-[14px] text-white tracking-wider uppercase font-black">
              MESCE FM 108.1
            </span>
            <span className="text-[10px] text-white/60 flex items-center gap-1.5 mt-0.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] animate-ping"></span>
              LIVE ON-AIR • KUTTIPPURAM
            </span>
          </div>

          <button
            onClick={handleShare}
            aria-label="Share broadcast"
            className="w-10 h-10 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-transform active:scale-90 relative cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            {copyFeedback && (
              <span className="absolute -bottom-7 right-0 text-[10px] bg-white text-black px-2 py-0.5 rounded shadow font-bold whitespace-nowrap">
                Copied Link!
              </span>
            )}
          </button>
        </div>

        {/* Live RJ Microphone Speaking Alert Banner */}
        {liveMicBroadcast?.isLive && (
          <div className="w-full mb-3 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white py-2 px-3.5 rounded-2xl flex items-center justify-between text-[11px] font-black animate-pulse shadow-lg border border-white/20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-white animate-ping shrink-0"></span>
              <span className="material-symbols-outlined text-[16px] shrink-0">mic</span>
              <span className="truncate">
                🎙️ LIVE RJ TALKING: {liveMicBroadcast.speaker || 'Central Studio'}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-md font-mono shrink-0">
              Music Ducked
            </span>
          </div>
        )}

        {/* Station Artwork Hero: Circular glowing disc with Album Artwork */}
        <div className="relative my-3 flex items-center justify-center">
          {/* Exterior Concentric Pulse Rings */}
          <div
            className={`absolute w-64 h-64 rounded-full bg-[#ff7a00]/5 pointer-events-none transition-all duration-700 ${
              isPlaying ? 'scale-105 animate-pulse' : 'scale-90 opacity-40'
            }`}
          ></div>
          <div
            className={`absolute w-56 h-56 rounded-full bg-white/5 pointer-events-none transition-all duration-700 ${
              isPlaying ? 'animate-pulse [animation-delay:150ms]' : 'opacity-30'
            }`}
          ></div>

          {/* Vinyl Disc Container */}
          <div
            className={`relative w-52 h-52 rounded-full p-2.5 bg-gradient-to-tr from-[#2c2c2e] via-[#1c1c1e] to-[#38383a] shadow-[0_16px_36px_-8px_rgba(0,0,0,0.7)] border border-white/10 flex items-center justify-center transition-all ${
              isPlaying ? 'hover:scale-[1.02]' : ''
            }`}
          >
            <div
              className={`w-full h-full rounded-full bg-[#121214] flex flex-col items-center justify-center text-center p-3 relative overflow-hidden shadow-inner ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-slow paused'
              }`}
            >
              {/* If actual album art is available, display it in the centre with vinyl concentric rings */}
              {nowPlaying?.cover ? (
                <>
                  <img
                    src={nowPlaying.cover}
                    alt={nowPlaying.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-85"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
                    }}
                  />
                  {/* Vinyl center hub */}
                  <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/75"></div>
                  <div className="w-14 h-14 rounded-full bg-[#1c1c1e] border-2 border-[#ff7a00] flex flex-col items-center justify-center z-10 shadow-lg">
                    <span className="text-[9px] font-black text-[#ff7a00] font-mono leading-none">108.1</span>
                    <span className="text-[7px] font-extrabold text-white/70 leading-none">MESCE</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Vinyl Groove Pattern */}
                  <div className="absolute inset-0 rounded-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-black"></div>
                  <span className="text-[26px] text-white font-black tracking-tighter leading-none select-none z-10 font-mono">
                    MESCE
                  </span>
                  <span className="text-[14px] text-[#ff7a00] font-extrabold tracking-widest leading-tight mt-0.5 z-10 font-mono">
                    108.1 FM
                  </span>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#2c2c2e] text-[#ff7a00] border border-white/10 text-[8px] tracking-widest uppercase font-black z-10 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d26a] animate-pulse"></span>
                    CAMPUS LIVE
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Transmission Status Pill */}
        <div className="flex items-center gap-2 mt-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2c2c2e] border border-white/10 text-white text-[11px] uppercase tracking-wider font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00d26a] animate-pulse"></span>
            Actual On-Air Stream
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#242426] border border-white/5 text-white/70 text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px] text-[#ff7a00]">headphones</span>
            {radioState?.listenersCount || 428} Tuning In
          </span>
        </div>

        {/* Track Metadata */}
        <div className="flex flex-col items-center text-center mt-1 mb-2 w-full px-2">
          <h2 className="text-[20px] text-white font-black tracking-tight leading-tight line-clamp-1">
            {nowPlaying?.title || currentShow?.title}
          </h2>
          <p className="text-[13px] text-[#ff7a00] font-bold mt-0.5">
            {nowPlaying?.artist || currentShow?.rj}
          </p>
          {nowPlaying?.album && (
            <p className="text-[11px] text-white/40 font-medium truncate max-w-[280px]">
              {nowPlaying.album}
            </p>
          )}

          {/* DEDICATION SHOUTOUT CARD (If currently playing track was dedicated) */}
          {dedication && (
            <div className="w-full mt-2.5 p-3 rounded-2xl bg-[#242426] border border-[#ff7a00]/30 flex flex-col gap-1 text-left shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7a00] flex items-center gap-1">
                  <span>💌</span> LIVE LISTENER DEDICATION
                </span>
                <span className="text-[10px] font-bold text-white/70">
                  To: {dedication.to}
                </span>
              </div>
              <p className="text-[11px] text-white font-medium italic">
                "{dedication.message}"
              </p>
              <span className="text-[9px] text-white/40 font-bold">
                Requested by: {dedication.requester}
              </span>
            </div>
          )}
        </div>

        {/* Live Audio Equalizer Dynamic Waveform */}
        <div
          aria-label="Live audio frequency equalizer"
          className="w-full flex items-end justify-center gap-1.5 h-7 px-4 my-1.5"
        >
          {[3, 6, 7, 5, 8, 4, 6, 7, 5, 8, 4, 6, 7, 3].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                i % 2 === 0 ? 'bg-[#ff7a00]' : 'bg-[#ff9500]'
              } ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
              style={{
                height: isPlaying ? `${h * 3.5}px` : '4px',
                animationDuration: `${300 + (i % 5) * 60}ms`,
              }}
            ></div>
          ))}
        </div>

        {/* Live Interactive Scrubber & Time */}
        <div className="w-full mt-1 mb-4 px-2">
          <div
            onClick={handleScrubberClick}
            className="relative w-full py-2 cursor-pointer group"
          >
            <div className="w-full h-2 bg-[#2c2c2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff7a00] rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {/* Scrubber Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-white rounded-full shadow-md flex items-center justify-center ring-2 ring-[#ff7a00] transition-transform group-hover:scale-125"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="w-1.5 h-1.5 bg-[#ff7a00] rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/50 font-bold px-0.5 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span className="text-white/40">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Playback Controls Grid */}
        <div className="flex items-center justify-center gap-6 mb-5">
          {/* Previous / Replay Track */}
          <button
            onClick={onSkipPrev}
            aria-label="Previous track"
            title="Replay or previous song"
            className="w-13 h-13 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[28px]">skip_previous</span>
          </button>

          {/* Hero Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause live stream' : 'Play live stream'}
            className="w-18 h-18 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.5)] transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-6 rounded-full bg-black"></span>
                <span className="w-1.5 h-6 rounded-full bg-black"></span>
              </div>
            ) : (
              <span
                className="material-symbols-outlined text-[36px] ml-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
            )}
          </button>

          {/* Next / Skip to Queued Track */}
          <button
            onClick={onSkipNext}
            aria-label="Skip to next queued track"
            title="Play next song in queue"
            className="w-13 h-13 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] border border-white/5 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[28px]">skip_next</span>
          </button>
        </div>

        {/* Secondary Quick Actions Toolbar */}
        <div className="w-full pt-2.5 pb-2.5 flex items-center justify-between px-2 bg-[#242426] rounded-2xl border border-white/[0.08]">
          {/* Sleep Timer */}
          <button
            onClick={onOpenSleepTimer}
            aria-label="Set sleep timer"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-white/60 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              alarm
            </span>
            <span className="text-[10px] text-white/60 font-bold">
              {sleepMinutes ? `${sleepMinutes}m` : 'Sleep'}
            </span>
          </button>

          {/* Song Request */}
          <button
            onClick={onOpenRequestModal}
            aria-label="Request song on air"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#ff7a00] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              queue_music
            </span>
            <span className="text-[10px] text-[#ff7a00] font-extrabold">Request</span>
          </button>

          {/* Heart Favorite */}
          <button
            onClick={handleFavoriteWithConfetti}
            aria-label={isFavorite ? 'Station Favorited' : 'Favorite Station'}
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#ff3b30] transition-colors group cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform"
              style={{
                fontVariationSettings: isFavorite
                  ? "'FILL' 1, 'wght' 600"
                  : "'FILL' 0, 'wght' 400",
              }}
            >
              favorite
            </span>
            <span className="text-[10px] text-[#ff3b30] font-bold">
              {isFavorite ? 'Saved' : 'Favorite'}
            </span>
          </button>

          {/* HD Quality */}
          <button
            onClick={handleToggleQuality}
            aria-label="Audio bit rate quality"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-white/60 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="px-1.5 py-0.5 rounded bg-[#2c2c2e] text-[#ff7a00] font-black text-[9px] leading-none group-hover:scale-105 transition-transform font-mono border border-white/10">
              HD
            </span>
            <span className="text-[9px] text-white/50 font-bold truncate max-w-[45px]">
              {streamQuality.split(' ')[0]}
            </span>
          </button>

          {/* Equalizer & Audio Config */}
          <button
            onClick={onOpenEqualizer}
            aria-label="Equalizer presets"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-white/60 hover:text-white transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              tune
            </span>
            <span className="text-[10px] text-white/60 font-bold">Sound</span>
          </button>
        </div>

        {/* Dynamic Up Next Card */}
        <div className="w-full mt-3 bg-[#242426] rounded-2xl p-3 flex items-center justify-between border border-white/[0.08] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {nextQueuedTrack?.cover ? (
              <img
                src={nextQueuedTrack.cover}
                alt={nextQueuedTrack.title}
                className="w-10 h-10 rounded-xl object-cover shadow-xs shrink-0 border border-white/10"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#2c2c2e] text-[#ff7a00] border border-white/10 flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">queue_music</span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#ff7a00] uppercase tracking-wider font-extrabold flex items-center gap-1">
                <span>⚡ UP NEXT IN QUEUE</span>
                {queue.length > 1 && (
                  <span className="bg-[#2c2c2e] text-white text-[9px] px-1.5 py-0.2 rounded-full border border-white/10">
                    +{queue.length - 1} more
                  </span>
                )}
              </span>
              <span className="text-[13px] text-white font-black truncate">
                {nextQueuedTrack ? nextQueuedTrack.title : 'Continuous Malayalam Campus Beats'}
              </span>
              <span className="text-[10px] text-white/60 truncate">
                {nextQueuedTrack
                  ? `${nextQueuedTrack.artist} ${nextQueuedTrack.dedication ? `• Dedicated to ${nextQueuedTrack.dedication.to}` : ''}`
                  : 'MESCE FM Playlist Rotation'}
              </span>
            </div>
          </div>

          <button
            onClick={onSkipNext}
            className="text-[10px] bg-[#2c2c2e] hover:bg-[#ff7a00] text-white hover:text-black border border-white/10 font-black px-2.5 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-0.5"
          >
            <span>Play Next</span>
            <span className="material-symbols-outlined text-[13px]">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  )
}
