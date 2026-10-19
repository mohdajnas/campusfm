import React, { useState, useMemo } from 'react'

export function ExploreScreen({
  stations,
  currentStation,
  isPlaying,
  onSelectStation,
  onTogglePlay,
  favorites,
  onToggleFavorite,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('Search')
  const [selectedFilterChip, setSelectedFilterChip] = useState('All FM')
  const [selectedRegion, setSelectedRegion] = useState('All')

  const categoryTabs = ['Search', 'Top Stations', 'Discover', 'Top 40', 'Genres']
  const filterChips = ['All FM', 'Popular', 'News & Talk', 'Pop & Dance', 'Classic Rock']
  const regions = ['All', 'Sri Lanka', 'USA', 'UK']

  // Filtered stations logic
  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesQuery =
          station.name.toLowerCase().includes(q) ||
          station.city.toLowerCase().includes(q) ||
          station.country.toLowerCase().includes(q) ||
          station.frequency.toLowerCase().includes(q) ||
          station.genre.toLowerCase().includes(q)
        if (!matchesQuery) return false
      }

      // Region filter
      if (selectedRegion !== 'All') {
        if (selectedRegion === 'Sri Lanka' && station.region !== 'Sri Lanka') return false
        if (selectedRegion === 'USA' && station.region !== 'USA') return false
        if (selectedRegion === 'UK' && station.region !== 'UK') return false
      }

      // Chip filter
      if (selectedFilterChip === 'Popular') {
        return parseFloat(station.listeners) > 10
      }
      if (selectedFilterChip === 'News & Talk') {
        return station.genre.includes('News') || station.category === 'news'
      }
      if (selectedFilterChip === 'Pop & Dance') {
        return station.genre.includes('Pop') || station.genre.includes('Dance')
      }
      if (selectedFilterChip === 'Classic Rock') {
        return station.genre.includes('Rock')
      }

      return true
    })
  }, [stations, searchQuery, selectedFilterChip, selectedRegion])

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Electric Violet Hero Section */}
      <section className="bg-[#3814d4] text-white px-5 pt-3 pb-9 relative overflow-hidden shadow-[0_16px_36px_-10px_rgba(56,20,212,0.5)]">
        {/* Ambient subtle background sonic wave graphic */}
        <div className="absolute -right-12 -top-10 w-64 h-64 rounded-full bg-[#523eec]/25 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-[#e40468]/20 blur-2xl pointer-events-none"></div>

        {/* Category Nav Tabs */}
        <div className="flex items-center space-x-6 overflow-x-auto no-scrollbar pb-1 text-[#c5c0ff]">
          {categoryTabs.map((tab) => {
            const isTabActive = selectedCategoryTab === tab
            return (
              <button
                key={tab}
                onClick={() => setSelectedCategoryTab(tab)}
                className={`text-[15px] pb-1 whitespace-nowrap transition-all flex flex-col items-center cursor-pointer ${
                  isTabActive
                    ? 'text-white font-bold'
                    : 'text-[#c5c0ff]/70 hover:text-white font-medium'
                }`}
              >
                <span>{tab}</span>
                {isTabActive && (
                  <span className="w-5 h-0.5 bg-[#ffdea8] rounded-full mt-1"></span>
                )}
              </button>
            )
          })}
        </div>

        {/* Search Input Capsule */}
        <div className="mt-4 relative flex items-center">
          <span className="material-symbols-outlined text-white/60 absolute left-4 pointer-events-none text-[20px]">
            search
          </span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country, city or frequency..."
            className="w-full bg-white/12 hover:bg-white/18 focus:bg-white/20 text-white placeholder:text-white/60 text-[14px] pl-11 pr-10 py-3 rounded-full outline-none backdrop-blur-md transition-all shadow-inner border border-white/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3.5 w-6 h-6 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Current Location / Query Summary Banner */}
        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[#ffba20] text-[11px] uppercase tracking-widest font-bold mb-1">
              <span className="material-symbols-outlined text-[14px]">location_on</span>
              <span>Curated Region</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-[26px] font-extrabold text-white tracking-tight">
                {selectedRegion === 'All' ? 'Global Broadcast' : selectedRegion}
              </h1>
            </div>
            <p className="text-[12px] text-[#c5c0ff] mt-0.5">
              {filteredStations.length} stations live •{' '}
              {stations.filter((s) => favorites.includes(s.id)).length} favorites saved
            </p>
          </div>

          {/* Region Switcher Pills */}
          <div className="flex items-center gap-1">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-white text-[#3814d4] shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stations Sheet (Sliding Sheet Card Container) */}
      <section className="bg-white -mt-5 rounded-t-3xl px-5 pt-3 pb-24 shadow-[0_-10px_30px_rgba(36,0,160,0.08)] z-10 flex flex-col">
        {/* Drag Pill Indicator */}
        <div className="w-10 h-1 bg-[#c8c4d8]/60 rounded-full mx-auto mb-4"></div>

        {/* Quick filter pill chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 py-0.5">
          {filterChips.map((chip) => {
            const isChipActive = selectedFilterChip === chip
            return (
              <button
                key={chip}
                onClick={() => setSelectedFilterChip(chip)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isChipActive
                    ? 'bg-[#3814d4] text-white shadow-sm'
                    : 'bg-[#ebe5ff] text-[#474556] hover:bg-[#e6deff]'
                }`}
              >
                {chip}
              </button>
            )
          })}
        </div>

        {/* Stations List */}
        <div className="flex flex-col gap-2">
          {filteredStations.map((station) => {
            const isThisPlaying = currentStation?.id === station.id && isPlaying
            const isFav = favorites.includes(station.id)

            return (
              <article
                key={station.id}
                onClick={() => onSelectStation(station)}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-[#f7f1ff] transition-all cursor-pointer border border-transparent hover:border-[#e6deff]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                    {station.logo ? (
                      <img
                        src={station.logo}
                        alt={station.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-white font-extrabold text-[12px] ${
                          station.avatarBg || 'bg-[#3814d4]'
                        }`}
                      >
                        {station.initials || station.callSign || 'FM'}
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#ff2a7a] ring-2 ring-white"></span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-[15px] font-extrabold text-[#1c163b] truncate">
                        {station.name}
                      </h2>
                      <span className="bg-[#e6deff] text-[#3814d4] px-1.5 py-0.5 rounded text-[10px] font-bold">
                        LIVE
                      </span>
                    </div>
                    <p className="text-[12px] text-[#474556] truncate mt-0.5">
                      {station.tag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-2">
                  <span className="text-[13px] font-black text-[#1c163b] font-mono">
                    {station.frequency}
                  </span>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(station.id)
                    }}
                    aria-label={`Favorite ${station.name}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isFav
                        ? 'text-[#e40468] hover:bg-[#ffd9df]'
                        : 'text-[#777587] hover:text-[#e40468] hover:bg-[#f7f1ff]'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{
                        fontVariationSettings: isFav
                          ? "'FILL' 1, 'wght' 600"
                          : "'FILL' 0, 'wght' 400",
                      }}
                    >
                      favorite
                    </span>
                  </button>

                  {/* Play Button */}
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
              </article>
            )
          })}

          {filteredStations.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl text-[#777587] mb-2">
                radio
              </span>
              <p className="text-[15px] font-bold text-[#1c163b]">No stations found</p>
              <p className="text-[12px] text-[#474556] mt-1">
                Try searching for another genre, frequency, or city
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
