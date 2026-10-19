import React, { useState } from 'react'

export function FavoritesScreen({
  stations,
  currentStation,
  isPlaying,
  onSelectStation,
  onTogglePlay,
  favorites,
  onToggleFavorite,
  onOpenAlarmModal,
}) {
  const [filterCategory, setFilterCategory] = useState('all')

  const categoryFilters = [
    { id: 'all', label: `All Stations (${favorites.length})` },
    { id: 'music', label: 'Music' },
    { id: 'news', label: 'News & Talk' },
    { id: 'podcasts', label: 'Podcasts' },
  ]

  const favoriteStations = stations.filter((s) => favorites.includes(s.id))

  const filteredList = favoriteStations.filter((s) => {
    if (filterCategory === 'all') return true
    if (filterCategory === 'music') return s.category === 'music'
    if (filterCategory === 'news') return s.category === 'news'
    return true
  })

  // Pick top 2 hero stations for the dual cards
  const heroStation1 = favoriteStations.find((s) => s.id === 'kzoq') || favoriteStations[0]
  const heroStation2 = favoriteStations.find((s) => s.id === 'kiis-fm') || favoriteStations[1]

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Dynamic Audio Atmosphere & Stats Card */}
      <div className="px-5 mb-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#3814d4] text-white p-5 shadow-[0_16px_36px_-10px_rgba(56,20,212,0.4)]">
          {/* Ambient decorative gradient orbs */}
          <div className="absolute -right-8 -top-10 w-36 h-36 rounded-full bg-[#ff2a7a]/30 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-6 -bottom-8 w-32 h-32 rounded-full bg-[#523eec]/40 blur-xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/15 backdrop-blur-md text-[#ffba20]">
                  <span className="material-symbols-outlined text-[16px]">local_fire_department</span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5c0ff]">
                  7-Day Radio Streak
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffdea8] animate-pulse"></span>
                Syncing HD
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[32px] font-black text-white leading-none">38.4</span>
                  <span className="text-[15px] text-[#c5c0ff] font-bold">hrs</span>
                </div>
                <p className="text-[12px] text-[#b1abff] mt-1 font-medium">
                  Listened across {favorites.length} saved frequencies
                </p>
              </div>

              {/* Dynamic Audio Wave Graphic */}
              <div className="flex items-end gap-1 h-9 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm">
                <span
                  className={`w-1 bg-[#ffd9df] rounded-full transition-all ${
                    isPlaying ? 'h-3 animate-pulse' : 'h-2'
                  }`}
                ></span>
                <span
                  className={`w-1 bg-[#ff2a7a] rounded-full transition-all ${
                    isPlaying ? 'h-7 animate-bounce' : 'h-3'
                  }`}
                ></span>
                <span
                  className={`w-1 bg-white rounded-full transition-all ${
                    isPlaying ? 'h-5 animate-pulse' : 'h-2'
                  }`}
                ></span>
                <span
                  className={`w-1 bg-[#c5c0ff] rounded-full transition-all ${
                    isPlaying ? 'h-8 animate-bounce' : 'h-4'
                  }`}
                ></span>
                <span
                  className={`w-1 bg-[#ffdea8] rounded-full transition-all ${
                    isPlaying ? 'h-4 animate-pulse' : 'h-2'
                  }`}
                ></span>
                <span
                  className={`w-1 bg-white rounded-full transition-all ${
                    isPlaying ? 'h-6 animate-bounce' : 'h-3'
                  }`}
                ></span>
              </div>
            </div>

            {/* Quick utility strip inside banner */}
            <div className="grid grid-cols-3 gap-2 pt-2 mt-1">
              <button
                onClick={onOpenAlarmModal}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-full bg-white/12 hover:bg-white/20 transition-all text-white active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">alarm</span>
                <span className="text-[11px] font-bold">Radio Alarm</span>
              </button>

              <button
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-full bg-white/12 hover:bg-white/20 transition-all text-white active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">offline_pin</span>
                <span className="text-[11px] font-bold">Offline 128k</span>
              </button>

              <button
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-full bg-white/12 hover:bg-white/20 transition-all text-white active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">swap_vert</span>
                <span className="text-[11px] font-bold">Sort/Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Categories Scroll */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categoryFilters.map((cat) => {
            const isCatActive = filterCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer ${
                  isCatActive
                    ? 'bg-[#3814d4] text-white shadow-md active:scale-95'
                    : 'bg-[#ebe5ff] text-[#474556] hover:bg-[#e6deff]'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Dual Hero Instant Frequency Cards */}
      <div className="px-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-[#1c163b] flex items-center gap-1.5">
            <span>Instant Frequency</span>
            <span
              className="material-symbols-outlined text-[#e40468] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </h2>
          <span className="text-[11px] text-[#474556] font-semibold">Press to switch</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Featured Station 1: KZOQ (Electric Violet Brand Card) */}
          {heroStation1 && (
            <div
              onClick={() => onSelectStation(heroStation1)}
              className="group relative flex flex-col justify-between p-4 rounded-2xl bg-[#3814d4] text-white shadow-[0_14px_28px_-6px_rgba(56,20,212,0.38)] active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
                  <div className="w-full h-full rounded-full bg-[#e40468] flex items-center justify-center text-white font-black text-[12px]">
                    ZOQ
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00d26a] ring-2 ring-[#3814d4]"></span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentStation?.id === heroStation1.id) {
                      onTogglePlay()
                    } else {
                      onSelectStation(heroStation1)
                    }
                  }}
                  aria-label={`Play ${heroStation1.name}`}
                  className="w-10 h-10 rounded-full bg-white text-[#3814d4] flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {currentStation?.id === heroStation1.id && isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[13px] text-[#ffdea8] font-black tracking-tight font-mono">
                    {heroStation1.frequency}
                  </span>
                  <span className="text-[10px] text-[#c5c0ff] font-bold">• 98% HD</span>
                </div>
                <h3 className="text-[16px] leading-tight text-white truncate font-extrabold">
                  {heroStation1.callSign || heroStation1.name}
                </h3>
                <p className="text-[11px] text-[#c5c0ff] truncate mt-0.5">
                  {heroStation1.tag}
                </p>
              </div>
            </div>
          )}

          {/* Featured Station 2: KIIS 102.7 FM (Clean Milk-White Layered Card) */}
          {heroStation2 && (
            <div
              onClick={() => onSelectStation(heroStation2)}
              className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white text-[#1c163b] shadow-[0_12px_28px_-8px_rgba(15,8,46,0.12)] border border-[#e6deff]/40 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="relative w-11 h-11 rounded-full bg-[#f1ebff] flex items-center justify-center p-1">
                  <div className="w-full h-full rounded-full bg-[#523eec] text-white flex items-center justify-center font-black text-[12px]">
                    KIIS
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#e40468] ring-2 ring-white"></span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentStation?.id === heroStation2.id) {
                      onTogglePlay()
                    } else {
                      onSelectStation(heroStation2)
                    }
                  }}
                  aria-label={`Play ${heroStation2.name}`}
                  className="w-10 h-10 rounded-full bg-[#3814d4] text-white flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {currentStation?.id === heroStation2.id && isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-[13px] text-[#e40468] font-black tracking-tight font-mono">
                    {heroStation2.frequency}
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#e40468] animate-ping"></span>
                </div>
                <h3 className="text-[16px] leading-tight text-[#1c163b] truncate font-extrabold">
                  {heroStation2.callSign || heroStation2.name}
                </h3>
                <p className="text-[11px] text-[#474556] truncate mt-0.5">
                  {heroStation2.currentTrack?.title || heroStation2.tag}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Primary Station Library Section */}
      <div className="px-5 flex flex-col gap-2.5 mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[16px] font-bold text-[#1c163b]">Station Library</h2>
          <button className="text-[11px] text-[#3814d4] hover:text-[#523eec] font-bold uppercase tracking-wider flex items-center gap-0.5 cursor-pointer">
            <span>Manage</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>

        {filteredList.map((station) => {
          const isThisPlaying = currentStation?.id === station.id && isPlaying
          return (
            <div
              key={station.id}
              onClick={() => onSelectStation(station)}
              className="group relative flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#f7f1ff] transition-all shadow-[0_4px_16px_rgba(36,0,160,0.04)] border border-[#e6deff]/40 active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-extrabold text-[12px] shadow-sm ${
                    station.avatarBg || 'bg-[#3814d4]'
                  }`}
                >
                  {station.initials || station.callSign || 'FM'}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-[#1c163b] truncate">
                      {station.name}
                    </h3>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#f1ebff] text-[#474556] text-[10px] font-bold font-mono">
                      {station.frequency}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#474556] truncate mt-0.5">
                    {station.tag}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleFavorite(station.id)
                  }}
                  aria-label="Remove favorite"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[#e40468] hover:bg-[#ffd9df] transition-colors cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentStation?.id === station.id) {
                      onTogglePlay()
                    } else {
                      onSelectStation(station)
                    }
                  }}
                  aria-label={`Play ${station.name}`}
                  className="w-9 h-9 rounded-full bg-[#3814d4] text-white flex items-center justify-center shadow-md active:scale-95 group-hover:scale-105 transition-all cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isThisPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>
          )
        })}

        {filteredList.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-[#474556]">No favorite stations saved yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
