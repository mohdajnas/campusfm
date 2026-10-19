import React, { useState } from 'react'

export function HomeScreen({
  stations,
  currentStation,
  isPlaying,
  onSelectStation,
  onTogglePlay,
  favorites,
  onToggleFavorite,
  onNavigateToFavorites,
  onFrequencyTune,
}) {
  const [activeTab, setActiveTab] = useState('recent')
  const [tunedFreq, setTunedFreq] = useState(currentStation?.freqNum || 102.7)

  const filterTabs = [
    { id: 'recent', label: 'Recent' },
    { id: 'recommended', label: 'Recommended' },
    { id: 'trending', label: 'Trending' },
    { id: 'local', label: 'Local Stations' },
  ]

  // Filter stations for the carousel based on tab
  const getCarouselStations = () => {
    if (activeTab === 'recent') {
      return stations.slice(0, 5)
    } else if (activeTab === 'recommended') {
      return stations.filter((s) => s.category === 'music').slice(0, 5)
    } else if (activeTab === 'trending') {
      return [...stations].sort((a, b) => parseFloat(b.listeners) - parseFloat(a.listeners)).slice(0, 5)
    } else {
      return stations.filter((s) => s.region === 'USA' || s.region === 'UK')
    }
  }

  // Handle frequency slider change
  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value)
    setTunedFreq(val)
    if (onFrequencyTune) {
      onFrequencyTune(val)
    }
  }

  const carouselStations = getCarouselStations()
  const favoriteStationsList = stations.filter((s) => favorites.includes(s.id)).slice(0, 4)

  return (
    <div className="flex flex-col w-full pb-6">
      {/* Top Horizontal Filter Tabs */}
      <div className="px-5 pt-3 pb-2">
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar scroll-smooth">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center shrink-0 cursor-pointer transition-all ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-90'
                }`}
              >
                <span
                  className={`text-[16px] leading-tight ${
                    isActive ? 'text-[#1c163b] font-bold' : 'text-[#474556] font-medium'
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`w-5 h-1 rounded-full mt-1.5 transition-all ${
                    isActive ? 'bg-[#3814d4]' : 'bg-transparent'
                  }`}
                ></span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured / Recent Stations Horizontal Carousel */}
      <div className="mt-3 pl-5 overflow-x-auto no-scrollbar pb-6 flex items-stretch space-x-4">
        {carouselStations.map((station, idx) => {
          const isThisPlaying = currentStation?.id === station.id && isPlaying
          const isHeroViolet = station.id === 'kzoq' || idx === 0

          if (isHeroViolet) {
            return (
              <div
                key={station.id}
                onClick={() => onSelectStation(station)}
                className="relative shrink-0 w-52 bg-[#3814d4] text-white rounded-2xl p-5 shadow-[0_16px_32px_-8px_rgba(56,20,212,0.42)] flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98] transition-transform group"
              >
                {/* Ambient decorative gradient splash inside card */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#523eec] opacity-35 rounded-full blur-2xl pointer-events-none"></div>

                {/* Top Row: Station Avatar & Play FAB Button */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="relative">
                    {station.logo ? (
                      <img
                        className="w-12 h-12 rounded-full object-cover bg-white p-0.5 shadow-md"
                        src={station.logo}
                        alt={station.name}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#e40468] text-white flex items-center justify-center font-black text-sm shadow-md">
                        {station.callSign || 'FM'}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#e40468] ring-2 ring-[#3814d4] animate-pulse"></span>
                  </div>

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
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-sm cursor-pointer"
                  >
                    <span
                      className="material-symbols-outlined text-[26px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isThisPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                </div>

                {/* Station Info */}
                <div className="mt-6 relative z-10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-extrabold text-[#e3dfff] uppercase tracking-wider">
                      {station.frequency}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(station.id)
                      }}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        style={{
                          fontVariationSettings: favorites.includes(station.id)
                            ? "'FILL' 1"
                            : "'FILL' 0",
                        }}
                      >
                        {favorites.includes(station.id) ? 'favorite' : 'more_horiz'}
                      </span>
                    </button>
                  </div>
                  <h3 className="text-[20px] font-extrabold leading-tight tracking-tight text-white">
                    {station.callSign || station.name}
                  </h3>
                  <p className="text-[11px] text-[#c5c0ff] line-clamp-2 mt-1 leading-snug">
                    {station.tag}
                  </p>
                </div>

                {/* Live broadcast tag */}
                <div className="mt-4 pt-3 flex items-center justify-between border-t border-white/15 relative z-10">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#ff2a7a] animate-pulse"></span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white/90">
                      Live Now
                    </span>
                  </div>
                  <span className="text-[10px] text-white/75 font-semibold">
                    {station.bitrate}
                  </span>
                </div>
              </div>
            )
          }

          // Light Clean Tile Card
          return (
            <div
              key={station.id}
              onClick={() => onSelectStation(station)}
              className="relative shrink-0 w-52 bg-white text-[#1c163b] rounded-2xl p-5 shadow-[0_12px_28px_-6px_rgba(36,0,160,0.1)] border border-[#e6deff]/40 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98] transition-transform group"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="relative">
                  {station.logo ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover bg-[#f1ebff] p-0.5 shadow-sm"
                      src={station.logo}
                      alt={station.name}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#f1ebff] text-[#3814d4] flex items-center justify-center font-extrabold text-xs shadow-sm">
                      {station.initials || station.callSign || 'FM'}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#523eec] ring-2 ring-white"></span>
                </div>

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
                  className="w-12 h-12 rounded-full bg-[#f1ebff] text-[#3814d4] hover:bg-[#e3dfff] active:scale-95 flex items-center justify-center transition-all shadow-sm cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[26px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isThisPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>

              <div className="mt-6 relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] font-extrabold text-[#3814d4]">
                    {station.frequency}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(station.id)
                    }}
                    className="text-[#474556]/60 hover:text-[#474556] transition-colors"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{
                        fontVariationSettings: favorites.includes(station.id)
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      {favorites.includes(station.id) ? 'favorite' : 'more_horiz'}
                    </span>
                  </button>
                </div>
                <h3 className="text-[20px] font-extrabold text-[#1c163b] leading-tight tracking-tight">
                  {station.callSign || station.name}
                </h3>
                <p className="text-[11px] text-[#474556] line-clamp-2 mt-1 leading-snug">
                  {station.tag}
                </p>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#f1ebff] relative z-10">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3814d4]"></span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#474556]">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-[#474556] font-medium">
                  {station.listeners} Tuning
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Favorite Stations Section */}
      <div className="px-5 mt-1">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <h2 className="text-[18px] font-extrabold text-[#1c163b]">Favorite Stations</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#ebe5ff] text-[#3814d4] text-[11px] font-bold">
              {favorites.length}
            </span>
          </div>
          <button
            onClick={onNavigateToFavorites}
            className="text-[13px] text-[#3814d4] hover:text-[#2400a0] font-bold flex items-center space-x-0.5 cursor-pointer"
          >
            <span>View all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-2 gap-3">
          {favoriteStationsList.map((st) => {
            const isStPlaying = currentStation?.id === st.id && isPlaying
            return (
              <div
                key={st.id}
                onClick={() => onSelectStation(st)}
                className="bg-white hover:bg-[#f7f1ff] transition-all rounded-2xl p-3 shadow-sm border border-[#e6deff]/40 flex items-center space-x-3 cursor-pointer group active:scale-[0.98]"
              >
                <div className="relative shrink-0">
                  {st.logo ? (
                    <img
                      className="w-11 h-11 rounded-full object-cover bg-[#f1ebff] p-0.5"
                      src={st.logo}
                      alt={st.name}
                    />
                  ) : (
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-extrabold text-[12px] shadow-sm ${st.avatarBg || 'bg-[#3814d4]'}`}
                    >
                      {st.initials || st.callSign || 'FM'}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-[14px] text-[#1c163b] font-extrabold truncate">
                    {st.callSign || st.name}
                  </h4>
                  <span className="text-[11px] leading-tight text-[#474556] block font-bold">
                    {st.frequency}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (currentStation?.id === st.id) {
                      onTogglePlay()
                    } else {
                      onSelectStation(st)
                    }
                  }}
                  aria-label={`Play ${st.name}`}
                  className="w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] group-hover:bg-[#3814d4] group-hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isStPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Frequency Skimmer Strip (Tactile Delight Micro-interaction) */}
      <div className="px-5 mt-5 mb-2">
        <div className="bg-[#f7f1ff] rounded-2xl p-4.5 border border-[#e6deff] flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#3814d4] text-[20px]">tune</span>
              <span className="text-[14px] font-bold text-[#1c163b]">Frequency Quick Tuner</span>
            </div>
            <span className="text-[17px] text-[#3814d4] font-black tracking-tight font-mono">
              {tunedFreq.toFixed(1)} MHz
            </span>
          </div>

          {/* Interactive Dial Track */}
          <div className="relative w-full py-1">
            <input
              type="range"
              min="87.5"
              max="108.0"
              step="0.1"
              value={tunedFreq}
              onChange={handleSliderChange}
              className="w-full accent-[#3814d4] h-2.5 bg-[#e6deff] rounded-full cursor-pointer appearance-none shadow-inner"
            />
            <div className="flex justify-between items-center text-[#474556] text-[10px] font-bold mt-1.5 px-1">
              <span>88.0</span>
              <span>94.0</span>
              <span>100.0</span>
              <span>104.0</span>
              <span>108.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
