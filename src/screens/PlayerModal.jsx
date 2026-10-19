import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export function PlayerModal({
  radioState,
  isPlaying,
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
  const [bufferProgress, setBufferProgress] = useState(82)

  const currentShow = radioState?.currentShow
  const nowPlaying = currentShow?.nowPlaying

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
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Listening to MESCE FM 108.1 - ${currentShow?.title}`,
          text: `Tune into MESCE FM 108.1: ${nowPlaying?.title} with ${currentShow?.rj}!`,
          url: window.location.href,
        })
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard?.writeText(
        `Tune into MESCE FM 108.1: ${nowPlaying?.title} hosted by ${currentShow?.rj}!`
      )
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    }
  }

  const handleToggleQuality = () => {
    const qualities = ['320k HD', '192k CD', '128k Data Saver']
    const nextIdx = (qualities.indexOf(streamQuality) + 1) % qualities.length
    setStreamQuality(qualities[nextIdx])
  }

  return (
    <div className="flex flex-col w-full px-4 pb-6 animate-fadeIn">
      {/* Full Screen Curved Modal Card */}
      <div className="w-full bg-white rounded-3xl shadow-[0_12px_40px_-10px_rgba(36,0,160,0.18)] border border-[#e6deff]/50 flex flex-col items-center pt-3 pb-8 px-5 relative overflow-hidden">
        {/* Ambient Soundwave Glow Backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#c5c0ff]/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Drag / Pull Indicator & Sheet Top Bar */}
        <div className="w-10 h-1 bg-[#c8c4d8]/60 rounded-full mb-3"></div>

        <div className="w-full flex items-center justify-between mb-4 z-10">
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
              CAMPUS ON-AIR • KUTTIPPURAM
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

        {/* Station Artwork Hero: Circular glowing disc with reactive pulse aura */}
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

          {/* Station Disc */}
          <div
            className={`relative w-48 h-48 rounded-full p-2.5 bg-gradient-to-tr from-[#e40468] via-[#3814d4] to-[#523eec] shadow-[0_16px_36px_-8px_rgba(228,4,104,0.45)] flex items-center justify-center transition-all ${
              isPlaying ? 'hover:scale-[1.02]' : ''
            }`}
          >
            <div
              className={`w-full h-full rounded-full bg-[#1c163b] flex flex-col items-center justify-center text-center p-3 relative overflow-hidden ${
                isPlaying ? 'animate-spin-slow' : 'animate-spin-slow paused'
              }`}
            >
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
            </div>
          </div>
        </div>

        {/* Live Transmission Status Pill */}
        <div className="flex items-center gap-2 mt-3 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffd9df] text-[#3f0017] text-[11px] uppercase tracking-wider font-extrabold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#e40468] animate-pulse"></span>
            Live Campus Feed
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ebe5ff] text-[#474556] text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">headphones</span>
            {radioState?.listenersCount || 428} Students Tuning In
          </span>
        </div>

        {/* Station Details & Currently Airing Meta */}
        <div className="flex flex-col items-center text-center mt-2 mb-3 w-full px-2">
          <h2 className="text-[20px] text-[#1c163b] font-black tracking-tight leading-tight">
            {currentShow?.title}
          </h2>
          <p className="text-[12px] text-[#3814d4] font-bold mt-0.5">
            Hosted by {currentShow?.rj}
          </p>

          {/* Now Playing Dynamic Track Bar */}
          <div className="w-full mt-3 py-2.5 px-3.5 rounded-2xl bg-[#f7f1ff] border border-[#e6deff]/60 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[#3814d4] text-[20px] shrink-0">
                graphic_eq
              </span>
              <div className="flex flex-col text-left truncate">
                <span className="text-[13px] text-[#1c163b] font-extrabold truncate">
                  {nowPlaying?.title || 'Live Campus Broadcast'}
                </span>
                <span className="text-[11px] text-[#474556] truncate">
                  {nowPlaying?.artist || 'MESCE Music Studio'} • {nowPlaying?.album || 'Live FM'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setTrackLiked(!trackLiked)}
              aria-label="Heart track"
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                trackLiked ? 'text-[#e40468]' : 'text-[#777587] hover:text-[#e40468]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[19px]"
                style={{
                  fontVariationSettings: trackLiked
                    ? "'FILL' 1, 'wght' 600"
                    : "'FILL' 0, 'wght' 400",
                }}
              >
                favorite
              </span>
            </button>
          </div>
        </div>

        {/* Live Audio Equalizer Dynamic Waveform (14 animated bars) */}
        <div
          aria-label="Live audio frequency equalizer"
          className="w-full flex items-end justify-center gap-1.5 h-8 px-4 my-2"
        >
          {[3, 6, 7, 5, 8, 4, 6, 7, 5, 8, 4, 6, 7, 3].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-200 ${
                i % 3 === 0
                  ? 'bg-[#3814d4]'
                  : i % 3 === 1
                  ? 'bg-[#e40468]'
                  : 'bg-[#523eec]'
              } ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
              style={{
                height: isPlaying ? `${h * 4}px` : '4px',
                animationDuration: `${300 + (i % 5) * 60}ms`,
              }}
            ></div>
          ))}
        </div>

        {/* Live Scrubber / Stream Buffer Progress */}
        <div className="w-full mt-1 mb-5 px-2">
          <div className="relative w-full flex items-center">
            <div className="w-full h-1.5 bg-[#e6deff] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3814d4] rounded-full transition-all"
                style={{ width: `${bufferProgress}%` }}
              ></div>
            </div>
            {/* Scrubber Thumb */}
            <div
              className="absolute -translate-x-1/2 w-4 h-4 bg-[#3814d4] rounded-full shadow-md flex items-center justify-center ring-2 ring-white cursor-pointer"
              style={{ left: `${bufferProgress}%` }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#474556] font-semibold mt-1.5 px-0.5">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#777587]">
                volume_down
              </span>
              Studio Master Feed
            </span>
            <span className="text-[#e40468] font-bold tracking-tight">LIVE BROADCAST</span>
          </div>
        </div>

        {/* Primary Playback Controls Grid */}
        <div className="flex items-center justify-center gap-8 mb-6">
          {/* Rewind 15s */}
          <button
            onClick={() => {
              confetti({ particleCount: 15, spread: 30 })
            }}
            aria-label="Rewind 15 seconds"
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[#474556] hover:text-[#3814d4] hover:bg-[#f1ebff] transition-all active:scale-95 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              replay_10
            </span>
            <span className="text-[8px] font-bold -mt-1">10s</span>
          </button>

          {/* Giant Play / Pause Hero Button (80x80px) */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause live stream' : 'Play live stream'}
            className="w-20 h-20 rounded-full bg-[#3814d4] text-white flex items-center justify-center shadow-[0_12px_28px_-4px_rgba(56,20,212,0.48),0_2px_8px_0_rgba(0,0,0,0.1)] transition-transform active:scale-95 hover:brightness-110 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[42px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Forward 15s */}
          <button
            onClick={() => {
              confetti({ particleCount: 15, spread: 30 })
            }}
            aria-label="Forward 15 seconds"
            className="w-12 h-12 rounded-full flex flex-col items-center justify-center text-[#474556] hover:text-[#3814d4] hover:bg-[#f1ebff] transition-all active:scale-95 cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              forward_10
            </span>
            <span className="text-[8px] font-bold -mt-1">10s</span>
          </button>
        </div>

        {/* Secondary Quick Actions Toolbar */}
        <div className="w-full pt-3 flex items-center justify-between px-2 bg-[#f7f1ff] rounded-2xl border border-[#e6deff]/40">
          {/* Sleep Timer */}
          <button
            onClick={onOpenSleepTimer}
            aria-label="Set sleep timer"
            className="flex flex-col items-center justify-center gap-1 w-12 py-1.5 text-[#474556] hover:text-[#3814d4] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
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
            className="flex flex-col items-center justify-center gap-1 w-12 py-1.5 text-[#3814d4] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              queue_music
            </span>
            <span className="text-[10px] text-[#3814d4] font-extrabold">Request</span>
          </button>

          {/* Heart Favorite */}
          <button
            onClick={handleFavoriteWithConfetti}
            aria-label={isFavorite ? 'Station Favorited' : 'Favorite Station'}
            className="flex flex-col items-center justify-center gap-1 w-12 py-1.5 text-[#e40468] transition-colors group cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform"
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
            className="flex flex-col items-center justify-center gap-1 w-12 py-1.5 text-[#3814d4] hover:text-[#2400a0] transition-colors group cursor-pointer"
          >
            <span className="px-1.5 py-0.5 rounded bg-[#e3dfff] text-[#140067] font-black text-[10px] leading-none group-hover:scale-105 transition-transform font-mono">
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
            className="flex flex-col items-center justify-center gap-1 w-12 py-1.5 text-[#474556] hover:text-[#3814d4] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
              tune
            </span>
            <span className="text-[10px] text-[#474556] font-bold">Sound</span>
          </button>
        </div>

        {/* Up Next Preview Sheet Peek */}
        <div className="w-full mt-3 bg-[#ebe5ff]/70 rounded-2xl p-3.5 flex items-center justify-between border border-[#c5c0ff]/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#3814d4] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">podcasts</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-[#474556] uppercase tracking-wider font-bold">
                Up Next on MESCE FM
              </span>
              <span className="text-[13px] text-[#1c163b] font-extrabold truncate">
                Twilight Melodies with RJ Devika
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#3814d4] font-extrabold shrink-0 bg-[#e3dfff] px-2 py-1 rounded-full">
            05:30 PM
          </span>
        </div>
      </div>
    </div>
  )
}
