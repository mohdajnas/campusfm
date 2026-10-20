import React, { useState } from 'react'

export function OnAirScreen({
  radioState,
  shows,
  hosts,
  podcasts,
  isPlaying,
  onTogglePlay,
  onPlayPodcast,
  onOpenAuditionModal,
  onOpenRequestModal,
  onSkipNext,
  onSkipPrev,
  currentTime = 0,
  duration = 0,
}) {
  const [scheduleDay, setScheduleDay] = useState('Today')
  const [selectedHost, setSelectedHost] = useState(null)

  const currentShow = radioState?.currentShow
  const nowPlaying = currentShow?.nowPlaying
  const alert = radioState?.emergencyAlert

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '3:25'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Emergency / Campus Important Alert Notice */}
      {alert?.active && (
        <div className="px-4 pt-2 pb-1">
          <div className="bg-gradient-to-r from-[#e40468] to-[#b70051] text-white p-3.5 rounded-2xl shadow-md flex items-start gap-3">
            <span className="material-symbols-outlined text-[22px] shrink-0 animate-pulse mt-0.5">
              campaign
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
                  OFFICIAL CAMPUS BROADCAST
                </span>
                <span className="text-[10px] text-white/80">{alert.timestamp}</span>
              </div>
              <h4 className="text-[13px] font-extrabold mt-1 leading-tight">{alert.title}</h4>
              <p className="text-[11px] text-white/90 mt-0.5 leading-snug">{alert.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Live Radio Player Card (Dark Tactile Widget matching Reference) */}
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-[34px] bg-[#1c1c1e] text-white p-3.5 sm:p-4 shadow-[0_22px_44px_-12px_rgba(0,0,0,0.55)] border border-white/[0.08]">
          {/* Top: Large Album Artwork with Gradient Overlay */}
          <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-[24px] overflow-hidden bg-[#242426]">
            <img
              src={
                nowPlaying?.cover ||
                'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
              }
              alt={nowPlaying?.title || 'Now Playing'}
              className="w-full h-full object-cover select-none"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80'
              }}
            />

            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-between p-3.5 sm:p-4">
              {/* Top Bar: 3:25 time badge & Actions */}
              <div className="flex items-center justify-between w-full">
                {/* Time pill badge (matches 3:25 badge in reference) */}
                <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#ff3b30] animate-pulse"></span>
                  <span className="text-[12px] font-bold text-white font-mono">
                    {currentTime > 0 ? formatTime(currentTime) : '3:25'}
                  </span>
                </div>

                {/* Right badge: listeners */}
                <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[13px] text-[#00d26a]">
                    headphones
                  </span>
                  <span>{radioState?.listenersCount || 428} Tuning</span>
                </div>
              </div>

              {/* Bottom text info (matches 'Now playing' + title in reference) */}
              <div className="flex flex-col">
                <span className="text-[12px] text-white/60 font-medium tracking-wide">
                  Now playing
                </span>
                <h3 className="text-[19px] sm:text-[21px] font-bold text-white tracking-tight leading-tight truncate mt-0.5">
                  {nowPlaying?.title || 'MESCE FM'}{' '}
                  <span className="text-white/60 font-normal">
                    – {nowPlaying?.artist || 'Campus Radio'}
                  </span>
                </h3>
                {currentShow && (
                  <p className="text-[11px] text-white/50 font-medium truncate mt-1">
                    {currentShow.title} • With {currentShow.rj}
                    {nowPlaying?.dedication ? ` • 💌 For ${nowPlaying.dedication.to}` : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Control Bar: Wide Pill Orange Pause/Play + Previous + Next */}
          <div className="flex items-center gap-2.5 mt-3.5">
            {/* Wide Pill Button with Vibrant Orange Pause Bars / Play Icon */}
            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex-1 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] active:scale-97 transition-all flex items-center justify-center cursor-pointer border border-white/5 shadow-md"
            >
              {isPlaying ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-5 rounded-full bg-[#ff7a00]"></span>
                  <span className="w-1.5 h-5 rounded-full bg-[#ff7a00]"></span>
                </div>
              ) : (
                <span
                  className="material-symbols-outlined text-[28px] text-[#ff7a00] ml-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              )}
            </button>

            {/* Previous Track Circle Button */}
            <button
              onClick={onSkipPrev}
              aria-label="Previous track"
              className="w-14 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/5 shadow-md text-white/90 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">skip_previous</span>
            </button>

            {/* Next Track Circle Button */}
            <button
              onClick={onSkipNext}
              aria-label="Next track"
              className="w-14 h-14 rounded-full bg-[#2c2c2e] hover:bg-[#38383a] active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white/5 shadow-md text-white/90 hover:text-white"
            >
              <span className="material-symbols-outlined text-[24px]">skip_next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dedicate a Song Big Button (Same Box Style) */}
      <div className="px-4 mt-3">
        <button
          onClick={onOpenRequestModal}
          className="w-full relative overflow-hidden rounded-[28px] bg-[#1c1c1e] hover:bg-[#252528] active:scale-[0.98] transition-all duration-200 text-white p-4 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.45)] border border-white/[0.08] flex items-center justify-between group cursor-pointer text-left"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Left Icon Pill */}
            <div className="w-12 h-12 rounded-2xl bg-[#2c2c2e] border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <span className="material-symbols-outlined text-[24px] text-[#ff7a00]">
                favorite
              </span>
            </div>

            {/* Label and Subtitle */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-[16px] font-black text-white leading-tight">
                  Dedicate a Song
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] text-[9px] font-black uppercase tracking-wider">
                  Live on Air
                </span>
              </div>
              <p className="text-[12px] text-white/60 font-medium truncate mt-0.5">
                Request any track with a personal shoutout on 108.1 FM
              </p>
            </div>
          </div>

          {/* Right Action Arrow Button */}
          <div className="w-10 h-10 rounded-full bg-[#2c2c2e] group-hover:bg-[#ff7a00] group-hover:text-white border border-white/5 flex items-center justify-center text-white/80 shrink-0 ml-3 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">
              arrow_forward
            </span>
          </div>
        </button>
      </div>

      {/* 2. Show Schedules & Timetable */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-extrabold text-neutral-900">Campus Broadcast Lineup</h3>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[#ff7a00] text-[10px] font-extrabold border border-neutral-200">
              5 Daily Shows
            </span>
          </div>
          <div className="flex gap-1 bg-neutral-100 p-0.5 rounded-full border border-neutral-200">
            {['Today', 'This Week'].map((t) => (
              <button
                key={t}
                onClick={() => setScheduleDay(t)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  scheduleDay === t ? 'bg-[#ff7a00] text-black shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {shows.map((show) => {
            const isCurrent = show.id === currentShow?.id
            return (
              <div
                key={show.id}
                className={`p-3.5 rounded-[22px] border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-[#242426] border-[#ff7a00]/40 shadow-lg'
                    : 'bg-[#1c1c1e] border-white/[0.08] hover:border-white/15'
                }`}
              >
                <img
                  src={show.cover}
                  alt={show.title}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm border border-white/5"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] font-extrabold text-[#ff7a00] font-mono">
                      {show.timeSlot}
                    </span>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#ff3b30]/20 text-[#ff3b30] text-[9px] font-black uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff3b30] animate-pulse"></span>
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40 font-semibold">{show.days}</span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-extrabold text-white truncate mt-0.5">
                    {show.title}
                  </h4>
                  <p className="text-[11px] text-white/70 font-semibold">{show.rj}</p>
                  <p className="text-[11px] text-white/40 line-clamp-1 mt-0.5">{show.genre}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Student Radio Host Profiles (DJs & RJs) */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[17px] font-extrabold text-neutral-900">Meet Your Campus RJs</h3>
            <p className="text-[11px] text-neutral-500">Student voices behind MESCE FM 108.1</p>
          </div>
          <button
            onClick={onOpenAuditionModal}
            className="text-[11px] font-extrabold text-[#ff7a00] bg-neutral-100 hover:bg-[#ff7a00] hover:text-black border border-neutral-200 px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-sm"
          >
            <span className="material-symbols-outlined text-[14px]">mic</span>
            <span>Audition</span>
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {hosts.map((host) => (
            <div
              key={host.id}
              onClick={() => setSelectedHost(host)}
              className="w-48 shrink-0 bg-[#1c1c1e] rounded-[24px] p-3.5 border border-white/[0.08] shadow-md hover:border-white/20 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-black text-white truncate">
                    {host.airName}
                  </h4>
                  <p className="text-[10px] text-[#ff7a00] font-bold truncate">{host.dept}</p>
                </div>
              </div>

              <p className="text-[11px] text-white/60 line-clamp-2 mt-2 leading-snug">
                {host.bio}
              </p>

              <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                <span className="text-[#ff7a00] font-bold">{host.social}</span>
                <span className="text-white/70 font-semibold flex items-center">
                  Profile <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Student Podcasts & Recorded Shows */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ff7a00] text-[20px]">
              podcasts
            </span>
            <h3 className="text-[17px] font-extrabold text-neutral-900">Campus Podcasts & Archives</h3>
          </div>
          <span className="text-[11px] text-neutral-500 font-semibold">Listen on demand</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {podcasts.map((pod) => (
            <div
              key={pod.id}
              className="p-3 rounded-[22px] bg-[#1c1c1e] border border-white/[0.08] shadow-md hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
            >
              <img
                src={pod.cover}
                alt={pod.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#ff7a00] font-mono">
                    {pod.duration}
                  </span>
                  <span className="text-[10px] text-white/40">• {pod.date}</span>
                </div>
                <h4 className="text-[13px] font-extrabold text-white truncate">{pod.title}</h4>
                <p className="text-[11px] text-white/60 truncate mt-0.5">{pod.host}</p>
              </div>

              <button
                onClick={() => onPlayPodcast(pod)}
                aria-label={`Play podcast ${pod.title}`}
                className="w-9 h-9 rounded-full bg-[#2c2c2e] text-white group-hover:bg-[#ff7a00] group-hover:text-black flex items-center justify-center transition-all cursor-pointer shrink-0 border border-white/5"
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Audition Banner Callout */}
      <div className="px-4 mt-6">
        <div className="bg-[#1c1c1e] border border-white/[0.08] text-white p-4.5 rounded-[28px] shadow-lg flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#ff7a00]/20 text-[#ff7a00] px-2 py-0.5 rounded-full">
              WANT YOUR OWN SHOW?
            </span>
            <h4 className="text-[16px] font-black mt-1 leading-tight">Join the MESCE FM Crew</h4>
            <p className="text-[11px] text-white/60 mt-0.5 leading-snug">
              Audition for guest host slots, podcaster spots, or tech sound engineering.
            </p>
          </div>
          <button
            onClick={onOpenAuditionModal}
            className="px-4 py-2.5 rounded-full bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-extrabold text-[12px] shadow-md transition-all cursor-pointer shrink-0 active:scale-95"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Host Detail Modal */}
      {selectedHost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1c1c1e] border border-white/[0.08] text-white rounded-[28px] p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setSelectedHost(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-3.5 pt-1">
              <img
                src={selectedHost.avatar}
                alt={selectedHost.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-white/10"
              />
              <div>
                <h3 className="text-[18px] font-black text-white">{selectedHost.airName}</h3>
                <p className="text-[12px] text-white/60 font-medium">{selectedHost.name}</p>
                <p className="text-[11px] text-[#ff7a00] font-bold">{selectedHost.dept}</p>
              </div>
            </div>

            <div className="bg-[#242426] border border-white/5 p-3 rounded-2xl mt-1">
              <span className="text-[10px] uppercase font-bold text-white/40 block mb-1">
                Bio & Campus Life
              </span>
              <p className="text-[12px] text-white/80 leading-relaxed">{selectedHost.bio}</p>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] uppercase font-bold text-white/40">Hosted Shows</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHost.shows.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold px-2.5 py-1 bg-[#2c2c2e] text-[#ff7a00] border border-white/5 rounded-lg"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
              <span className="text-[12px] font-bold text-[#ff7a00]">{selectedHost.social}</span>
              <button
                onClick={() => {
                  setSelectedHost(null)
                  onOpenRequestModal()
                }}
                className="text-[11px] font-extrabold px-3.5 py-1.5 bg-[#ff7a00] text-black hover:bg-[#ff8c1a] rounded-full transition-colors cursor-pointer"
              >
                Send RJ Shout-out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
