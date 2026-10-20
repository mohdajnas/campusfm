import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export function PlayerModal({
  radioState,
  isPlaying,
  currentTime = 0,
  duration = 30,
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
      <div className="w-full bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(36,0,160,0.18)] border border-[#e6deff]/50 flex flex-col items-center pt-3 pb-8 px-5 relative overflow-hidden">
        {/* Ambient Soundwave Glow Backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#c5c0ff]/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Drag / Pull Indicator & Sheet Top Bar */}
        <div className="w-10 h-1 bg-[#c8c4d8]/60 rounded-full mb-3"></div>

        <div className="w-full flex items-center justify-between mb-2 z-10">
          <button
            onClick={onClose}
            aria-label="Minimize player"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#474556] hover:bg-[#f1ebff] transition-transform active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">keyboard_arrow_down</span>
          </button>

          <div className="flex flex-col items-center text-center">
            <span className="text-[15px] text-[#1c163b] tracking-wider uppercase font-black">
              MESCE FM 108.1
            </span>
            <span className="text-[10px] text-[#474556] flex items-center gap-1.5 mt-0.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e40468] animate-ping"></span>
              LIVE ON-AIR • KUTTIPPURAM
            </span>
          </div>

          <button
            onClick={handleShare}
            aria-label="Share broadcast"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#474556] hover:bg-[#f1ebff] transition-transform active:scale-90 relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            {copyFeedback && (
              <span className="absolute -bottom-7 right-0 text-[10px] bg-[#1c163b] text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                Copied Link!
              </span>
            )}
          </button>
        </div>

        {/* Station Artwork Hero: Circular glowing disc with Album Artwork */}
        <div className="relative my-3 flex items-center justify-center">
          {/* Exterior Concentric Pulse Rings */}
          <div
            className={`absolute w-64 h-64 rounded-full bg-[#e40468]/10 pointer-events-none transition-all duration-700 ${
              isPlaying ? 'scale-105 animate-pulse' : 'scale-90 opacity-40'
            }`}
          ></div>
          <div
            className={`absolute w-56 h-56 rounded-full bg-[#3814d4]/10 pointer-events-none transition-all duration-700 ${
              isPlaying ? 'animate-pulse [animation-delay:150ms]' : 'opacity-30'
            }`}
          ></div>

          {/* Vinyl Disc Container */}
          <div
            className={`relative w-52 h-52 rounded-full p-2.5 bg-gradient-to-tr from-[#e40468] via-[#3814d4] to-[#ffdea8] shadow-[0_16px_36px_-8px_rgba(228,4,104,0.45)] flex items-center justify-center transition-all ${
              isPlaying ? 'hover:scale-[1.02]' : ''
            }`}
          >
            <div
              className={`w-full h-full rounded-full bg-[#1c163b] flex flex-col items-center justify-center text-center p-3 relative overflow-hidden shadow-inner ${
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
                  />
                  {/* Vinyl center hub */}
                  <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/70"></div>
                  <div className="w-14 h-14 rounded-full bg-[#1c163b] border-4 border-[#ffdea8] flex flex-col items-center justify-center z-10 shadow-lg">
                    <span className="text-[9px] font-black text-white font-mono leading-none">108.1</span>
                    <span className="text-[7px] font-extrabold text-[#ffb1c1] leading-none">MESCE</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Vinyl Groove Pattern */}
                  <div className="absolute inset-0 rounded-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-[#523eec]"></div>
                  <span className="text-[26px] text-white font-black tracking-tighter leading-none select-none z-10 font-mono">
                    MESCE
                  </span>
                  <span className="text-[14px] text-[#ffdea8] font-extrabold tracking-widest leading-tight mt-0.5 z-10 font-mono">
                    108.1 FM
                  </span>
                  <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#b70051] text-white text-[8px] tracking-widest uppercase font-black z-10 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    CAMPUS LIVE
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Live Transmission Status Pill */}
        <div className="flex items-center gap-2 mt-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9df] text-[#3f0017] text-[11px] uppercase tracking-wider font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#e40468] animate-pulse"></span>
            Actual On-Air Stream
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#474556] text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">headphones</span>
            {radioState?.listenersCount || 428} Tuning In
          </span>
        </div>

        {/* Track Metadata */}
        <div className="flex flex-col items-center text-center mt-1 mb-2 w-full px-2">
          <h2 className="text-[20px] text-[#1c163b] font-black tracking-tight leading-tight line-clamp-1">
            {nowPlaying?.title || currentShow?.title}
          </h2>
          <p className="text-[13px] text-[#3814d4] font-bold mt-0.5">
            {nowPlaying?.artist || currentShow?.rj}
          </p>
          {nowPlaying?.album && (
            <p className="text-[11px] text-[#777587] font-medium truncate max-w-[280px]">
              {nowPlaying.album}
            </p>
          )}

          {/* DEDICATION SHOUTOUT CARD (If currently playing track was dedicated) */}
          {dedication && (
            <div className="w-full mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-[#ffd9df] via-[#fffbf0] to-[#e3dfff] border border-[#e40468]/30 flex flex-col gap-1 text-left shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#b70051] flex items-center gap-1">
                  <span>💌</span> LIVE LISTENER DEDICATION
                </span>
                <span className="text-[10px] font-bold text-[#3814d4]">
                  To: {dedication.to}
                </span>
              </div>
              <p className="text-[11px] text-[#1c163b] font-medium italic">
                "{dedication.message}"
              </p>
              <span className="text-[9px] text-[#777587] font-bold">
                Requested by: {dedication.requester}
              </span>
            </div>
          )}
        </div>

        {/* Live Audio Equalizer Dynamic Waveform (14 animated bars) */}
        <div
          aria-label="Live audio frequency equalizer"
          className="w-full flex items-end justify-center gap-1.5 h-7 px-4 my-1.5"
        >
          {[3, 6, 7, 5, 8, 4, 6, 7, 5, 8, 4, 6, 7, 3].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                i % 3 === 0
                  ? 'bg-[#3814d4]'
                  : i % 3 === 1
                  ? 'bg-[#e40468]'
                  : 'bg-[#ffba20]'
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
            <div className="w-full h-2 bg-[#e6deff] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3814d4] to-[#e40468] rounded-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            {/* Scrubber Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-[#3814d4] rounded-full shadow-md flex items-center justify-center ring-2 ring-white transition-transform group-hover:scale-125"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#474556] font-bold px-0.5 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[#777587]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Primary Playback Controls Grid */}
        <div className="flex items-center justify-center gap-7 mb-5">
          {/* Previous / Replay Track */}
          <button
            onClick={onSkipPrev}
            aria-label="Previous track"
            title="Replay or previous song"
            className="w-12 h-12 rounded-full flex items-center justify-center text-[#474556] hover:text-[#3814d4] hover:bg-[#f1ebff] transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[32px]">skip_previous</span>
          </button>

          {/* Giant Play / Pause Hero Button (76x76px) */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause live stream' : 'Play live stream'}
            className="w-19 h-19 rounded-full bg-[#3814d4] text-white flex items-center justify-center shadow-[0_12px_28px_-4px_rgba(56,20,212,0.48),0_2px_8px_0_rgba(0,0,0,0.1)] transition-transform active:scale-95 hover:brightness-110 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next / Skip to Queued Track */}
          <button
            onClick={onSkipNext}
            aria-label="Skip to next queued track"
            title="Play next song in queue"
            className="w-12 h-12 rounded-full flex items-center justify-center text-[#474556] hover:text-[#3814d4] hover:bg-[#f1ebff] transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[32px]">skip_next</span>
          </button>
        </div>

        {/* Secondary Quick Actions Toolbar */}
        <div className="w-full pt-2.5 pb-2.5 flex items-center justify-between px-2 bg-[#f7f1ff] rounded-2xl border border-[#e6deff]/40">
          {/* Sleep Timer */}
          <button
            onClick={onOpenSleepTimer}
            aria-label="Set sleep timer"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#474556] hover:text-[#3814d4] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              alarm
            </span>
            <span className="text-[10px] text-[#474556] font-bold">
              {sleepMinutes ? `${sleepMinutes}m` : 'Sleep'}
            </span>
          </button>

          {/* Song Request */}
          <button
            onClick={onOpenRequestModal}
            aria-label="Request song on air"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#3814d4] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              queue_music
            </span>
            <span className="text-[10px] text-[#3814d4] font-extrabold">Request</span>
          </button>

          {/* Heart Favorite */}
          <button
            onClick={handleFavoriteWithConfetti}
            aria-label={isFavorite ? 'Station Favorited' : 'Favorite Station'}
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#e40468] transition-colors group cursor-pointer"
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
            <span className="text-[10px] text-[#e40468] font-bold">
              {isFavorite ? 'Saved' : 'Favorite'}
            </span>
          </button>

          {/* HD Quality */}
          <button
            onClick={handleToggleQuality}
            aria-label="Audio bit rate quality"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#3814d4] hover:text-[#2400a0] transition-colors group cursor-pointer"
          >
            <span className="px-1.5 py-0.5 rounded bg-[#e3dfff] text-[#140067] font-black text-[9px] leading-none group-hover:scale-105 transition-transform font-mono">
              HD
            </span>
            <span className="text-[9px] text-[#474556] font-bold truncate max-w-[45px]">
              {streamQuality.split(' ')[0]}
            </span>
          </button>

          {/* Equalizer & Audio Config */}
          <button
            onClick={onOpenEqualizer}
            aria-label="Equalizer presets"
            className="flex flex-col items-center justify-center gap-0.5 w-12 py-1 text-[#474556] hover:text-[#3814d4] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[19px] group-hover:scale-110 transition-transform">
              tune
            </span>
            <span className="text-[10px] text-[#474556] font-bold">Sound</span>
          </button>
        </div>

        {/* Dynamic Up Next Card */}
        <div className="w-full mt-3 bg-[#ebe5ff]/70 rounded-2xl p-3 flex items-center justify-between border border-[#c5c0ff]/40 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {nextQueuedTrack?.cover ? (
              <img
                src={nextQueuedTrack.cover}
                alt={nextQueuedTrack.title}
                className="w-10 h-10 rounded-xl object-cover shadow-xs shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#3814d4] text-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined text-[20px]">queue_music</span>
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#3814d4] uppercase tracking-wider font-extrabold flex items-center gap-1">
                <span>⚡ UP NEXT IN QUEUE</span>
                {queue.length > 1 && (
                  <span className="bg-[#3814d4] text-white text-[9px] px-1.5 py-0.2 rounded-full">
                    +{queue.length - 1} more
                  </span>
                )}
              </span>
              <span className="text-[13px] text-[#1c163b] font-black truncate">
                {nextQueuedTrack ? nextQueuedTrack.title : 'Continuous Malayalam Campus Beats'}
              </span>
              <span className="text-[10px] text-[#474556] truncate">
                {nextQueuedTrack
                  ? `${nextQueuedTrack.artist} ${nextQueuedTrack.dedication ? `• Dedicated to ${nextQueuedTrack.dedication.to}` : ''}`
                  : 'MESCE FM Playlist Rotation'}
              </span>
            </div>
          </div>

          <button
            onClick={onSkipNext}
            className="text-[10px] bg-[#3814d4] text-white font-black px-2.5 py-1.5 rounded-xl hover:bg-[#2400a0] transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95 flex items-center gap-0.5"
          >
            <span>Play Next</span>
            <span className="material-symbols-outlined text-[13px]">skip_next</span>
          </button>
        </div>
      </div>
    </div>
  )
}
