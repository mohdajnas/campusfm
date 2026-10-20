import React from 'react'

export function MiniPlayer({
  radioState,
  isPlaying,
  currentTime = 0,
  duration = 30,
  onTogglePlay,
  onSkipNext,
  onExpand,
  isFavorite,
  onToggleFavorite,
}) {
  const currentShow = radioState?.currentShow
  const nowPlaying = currentShow?.nowPlaying
  const dedication = nowPlaying?.dedication
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  return (
    <aside aria-label="Campus Radio Mini Player" className="w-full max-w-md mx-auto px-4 mb-2 z-30">
      <div
        onClick={onExpand}
        className="bg-[#1c1c1e] text-white rounded-[24px] shadow-[0_18px_38px_rgba(0,0,0,0.65)] flex flex-col cursor-pointer active:scale-[0.99] transition-all hover:border-white/[0.15] border border-white/[0.08] overflow-hidden relative"
      >
        <div className="p-3.5 flex items-center justify-between">
          {/* Left: Track Cover / Station Avatar & Info */}
          <div className="flex items-center space-x-3 min-w-0 flex-1 pr-2">
            <div className="relative shrink-0">
              {nowPlaying?.cover ? (
                <img
                  src={nowPlaying.cover}
                  alt={nowPlaying.title}
                  className={`w-11 h-11 rounded-xl object-cover shadow-md border border-white/10 ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                  }}
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-[#2c2c2e] border border-white/10 flex flex-col items-center justify-center text-white shadow-md">
                  <span className="text-[10px] font-black leading-none text-[#ff7a00]">108.1</span>
                  <span className="text-[8px] font-extrabold tracking-tighter text-white/60">MESCE</span>
                </div>
              )}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00d26a] rounded-full ring-2 ring-[#1c1c1e] animate-pulse"></span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-[13px] font-bold truncate text-white leading-tight">
                  {nowPlaying?.title || currentShow?.title || 'MESCE FM 108.1'}
                </h4>
                {/* Equalizer Sound Wave Animation */}
                <div
                  aria-label="Streaming Audio Wave"
                  className="flex items-end space-x-0.5 h-3 shrink-0"
                >
                  <span
                    className={`w-0.5 bg-[#ff7a00] rounded-full transition-all duration-300 ${
                      isPlaying ? 'h-3 animate-bounce' : 'h-1'
                    }`}
                  ></span>
                  <span
                    className={`w-0.5 bg-[#ff7a00] rounded-full transition-all duration-300 ${
                      isPlaying ? 'h-2 animate-pulse' : 'h-1'
                    }`}
                  ></span>
                  <span
                    className={`w-0.5 bg-[#ff7a00] rounded-full transition-all duration-300 ${
                      isPlaying ? 'h-3.5 animate-bounce [animation-delay:150ms]' : 'h-1'
                    }`}
                  ></span>
                  <span
                    className={`w-0.5 bg-[#ff7a00] rounded-full transition-all duration-300 ${
                      isPlaying ? 'h-1.5 animate-pulse [animation-delay:300ms]' : 'h-1'
                    }`}
                  ></span>
                </div>
              </div>

              <p className="text-[11px] text-white/60 truncate font-medium mt-0.5">
                {nowPlaying?.artist || currentShow?.rj || 'On Air'}
              </p>

              {/* Dedication Tag */}
              {dedication && (
                <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#ff7a00] font-bold truncate">
                  <span>💌</span>
                  <span className="truncate">For {dedication.to}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Favorite Toggle Heart */}
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isFavorite
                  ? 'text-[#ff3b30] hover:text-[#ff3b30]/80'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <span
                className="material-symbols-outlined text-[19px]"
                style={{
                  fontVariationSettings: isFavorite
                    ? "'FILL' 1, 'wght' 600"
                    : "'FILL' 0, 'wght' 400",
                }}
              >
                favorite
              </span>
            </button>

            {/* Play/Pause Button - Tactile styling */}
            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause live broadcast' : 'Resume live broadcast'}
              className="w-10 h-10 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] text-white border border-white/10 shadow-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3.5 rounded-full bg-[#ff7a00]"></span>
                  <span className="w-1 h-3.5 rounded-full bg-[#ff7a00]"></span>
                </div>
              ) : (
                <span
                  className="material-symbols-outlined text-[22px] text-[#ff7a00] ml-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              )}
            </button>

            {/* Skip / Next Track Button */}
            <button
              onClick={onSkipNext}
              aria-label="Skip to next track in queue"
              title="Play next song in queue"
              className="w-8 h-8 rounded-full text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <span className="material-symbols-outlined text-[20px]">skip_next</span>
            </button>
          </div>
        </div>

        {/* Live Bottom Playback Progress Strip */}
        <div className="w-full h-1 bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[#ff7a00] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </aside>
  )
}
