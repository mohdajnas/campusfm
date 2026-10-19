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
}) {
  const [scheduleDay, setScheduleDay] = useState('Today')
  const [selectedHost, setSelectedHost] = useState(null)

  const currentShow = radioState?.currentShow
  const nowPlaying = currentShow?.nowPlaying
  const alert = radioState?.emergencyAlert

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

      {/* 1. Live Radio Streaming Hero Card */}
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-3xl bg-[#3814d4] text-white p-5 shadow-[0_16px_36px_-8px_rgba(56,20,212,0.48)]">
          {/* Ambient decorative glowing bubbles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#e40468] opacity-35 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-[#523eec] opacity-40 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-3">
            {/* Top row: Live badge & Listeners */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e40468] text-white font-black text-[10px] uppercase tracking-widest shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  ON AIR NOW
                </span>
                <span className="text-[11px] text-[#e3dfff] font-mono font-bold">108.1 MHz</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-white">
                <span className="material-symbols-outlined text-[14px]">headphones</span>
                <span>{radioState?.listenersCount || 428} Tuning</span>
              </div>
            </div>

            {/* Show & Host Details */}
            <div className="mt-1">
              <span className="text-[11px] text-[#ffdea8] font-bold uppercase tracking-wider">
                {currentShow?.timeSlot}
              </span>
              <h2 className="text-[22px] font-black leading-tight tracking-tight mt-0.5 text-white">
                {currentShow?.title}
              </h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex -space-x-2 overflow-hidden">
                  {currentShow?.rjs?.map((rj, idx) => (
                    <img
                      key={idx}
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-[#3814d4] object-cover"
                      src={rj.avatar}
                      alt={rj.name}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-[#c5c0ff] font-semibold">
                  With {currentShow?.rj}
                </span>
              </div>
            </div>

            {/* Currently Playing Track Bar */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between mt-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#e40468] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[16px]">
                    music_note
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-extrabold text-white truncate leading-tight">
                    {nowPlaying?.title}
                  </p>
                  <p className="text-[10px] text-[#c5c0ff] truncate mt-0.5">
                    {nowPlaying?.artist}
                  </p>
                </div>
              </div>

              {/* Dynamic waveform indicator */}
              <div className="flex items-end gap-1 h-5 shrink-0 px-2">
                <span
                  className={`w-0.5 bg-[#ffdea8] rounded-full transition-all ${
                    isPlaying ? 'h-5 animate-pulse' : 'h-1'
                  }`}
                ></span>
                <span
                  className={`w-0.5 bg-[#e40468] rounded-full transition-all ${
                    isPlaying ? 'h-3 animate-bounce' : 'h-1'
                  }`}
                ></span>
                <span
                  className={`w-0.5 bg-white rounded-full transition-all ${
                    isPlaying ? 'h-4 animate-pulse' : 'h-1'
                  }`}
                ></span>
              </div>
            </div>

            {/* Action buttons inside hero */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={onOpenRequestModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">queue_music</span>
                <span>Request Song</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#c5c0ff] font-semibold font-mono">
                  {radioState?.streamQuality || '320k HD'}
                </span>
                <button
                  onClick={onTogglePlay}
                  aria-label={isPlaying ? 'Pause broadcast' : 'Play broadcast'}
                  className="w-12 h-12 rounded-full bg-white text-[#3814d4] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Show Schedules & Timetable */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-extrabold text-[#1c163b]">Campus Broadcast Lineup</h3>
            <span className="px-2 py-0.5 rounded-full bg-[#ebe5ff] text-[#3814d4] text-[10px] font-extrabold">
              5 Daily Shows
            </span>
          </div>
          <div className="flex gap-1 bg-[#f1ebff] p-0.5 rounded-full">
            {['Today', 'This Week'].map((t) => (
              <button
                key={t}
                onClick={() => setScheduleDay(t)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  scheduleDay === t ? 'bg-[#3814d4] text-white shadow-sm' : 'text-[#474556]'
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
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isCurrent
                    ? 'bg-[#f7f1ff] border-[#c5c0ff] shadow-sm'
                    : 'bg-white border-[#e6deff]/50 hover:bg-[#fdf8ff]'
                }`}
              >
                <img
                  src={show.cover}
                  alt={show.title}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold text-[#3814d4] font-mono">
                      {show.timeSlot}
                    </span>
                    {isCurrent ? (
                      <span className="px-1.5 py-0.2 rounded bg-[#ffd9df] text-[#e40468] text-[9px] font-black uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e40468] animate-pulse"></span>
                        LIVE
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#474556] font-semibold">{show.days}</span>
                    )}
                  </div>

                  <h4 className="text-[14px] font-extrabold text-[#1c163b] truncate mt-0.5">
                    {show.title}
                  </h4>
                  <p className="text-[11px] text-[#3814d4] font-semibold">{show.rj}</p>
                  <p className="text-[11px] text-[#474556] line-clamp-1 mt-0.5">{show.genre}</p>
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
            <h3 className="text-[17px] font-extrabold text-[#1c163b]">Meet Your Campus RJs</h3>
            <p className="text-[11px] text-[#474556]">Student voices behind MESCE FM 108.1</p>
          </div>
          <button
            onClick={onOpenAuditionModal}
            className="text-[11px] font-extrabold text-[#e40468] bg-[#ffd9df] px-3 py-1 rounded-full hover:bg-[#ffb1c1] transition-all cursor-pointer flex items-center gap-1"
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
              className="w-48 shrink-0 bg-white rounded-2xl p-3.5 border border-[#e6deff]/60 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#e6deff]"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-[13px] font-black text-[#1c163b] truncate">
                    {host.airName}
                  </h4>
                  <p className="text-[10px] text-[#3814d4] font-bold truncate">{host.dept}</p>
                </div>
              </div>

              <p className="text-[11px] text-[#474556] line-clamp-2 mt-2 leading-snug">
                {host.bio}
              </p>

              <div className="mt-3 pt-2 border-t border-[#f1ebff] flex items-center justify-between text-[10px]">
                <span className="text-[#e40468] font-bold">{host.social}</span>
                <span className="text-[#3814d4] font-semibold flex items-center">
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
            <span className="material-symbols-outlined text-[#3814d4] text-[20px]">
              podcasts
            </span>
            <h3 className="text-[17px] font-extrabold text-[#1c163b]">Campus Podcasts & Archives</h3>
          </div>
          <span className="text-[11px] text-[#474556] font-semibold">Listen on demand</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {podcasts.map((pod) => (
            <div
              key={pod.id}
              className="p-3 rounded-2xl bg-white border border-[#e6deff]/50 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-3 group"
            >
              <img
                src={pod.cover}
                alt={pod.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#3814d4] font-mono">
                    {pod.duration}
                  </span>
                  <span className="text-[10px] text-[#474556]">• {pod.date}</span>
                </div>
                <h4 className="text-[13px] font-extrabold text-[#1c163b] truncate">{pod.title}</h4>
                <p className="text-[11px] text-[#474556] truncate mt-0.5">{pod.host}</p>
              </div>

              <button
                onClick={() => onPlayPodcast(pod)}
                aria-label={`Play podcast ${pod.title}`}
                className="w-9 h-9 rounded-full bg-[#f1ebff] text-[#3814d4] group-hover:bg-[#3814d4] group-hover:text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
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
        <div className="bg-gradient-to-r from-[#3814d4] via-[#523eec] to-[#e40468] text-white p-4.5 rounded-3xl shadow-lg flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              WANT YOUR OWN SHOW?
            </span>
            <h4 className="text-[16px] font-black mt-1 leading-tight">Join the MESCE FM Crew</h4>
            <p className="text-[11px] text-[#e3dfff] mt-0.5 leading-snug">
              Audition for guest host slots, podcaster spots, or tech sound engineering.
            </p>
          </div>
          <button
            onClick={onOpenAuditionModal}
            className="px-4 py-2.5 rounded-full bg-white text-[#3814d4] font-extrabold text-[12px] shadow-md hover:bg-[#ffdea8] hover:text-[#1c163b] transition-all cursor-pointer shrink-0 active:scale-95"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Host Detail Modal */}
      {selectedHost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setSelectedHost(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-3.5 pt-1">
              <img
                src={selectedHost.avatar}
                alt={selectedHost.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-[#e6deff]"
              />
              <div>
                <h3 className="text-[18px] font-black text-[#1c163b]">{selectedHost.airName}</h3>
                <p className="text-[12px] text-[#474556] font-medium">{selectedHost.name}</p>
                <p className="text-[11px] text-[#3814d4] font-bold">{selectedHost.dept}</p>
              </div>
            </div>

            <div className="bg-[#f7f1ff] p-3 rounded-2xl mt-1">
              <span className="text-[10px] uppercase font-bold text-[#777587] block mb-1">
                Bio & Campus Life
              </span>
              <p className="text-[12px] text-[#1c163b] leading-relaxed">{selectedHost.bio}</p>
            </div>

            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-[10px] uppercase font-bold text-[#777587]">Hosted Shows</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedHost.shows.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold px-2.5 py-1 bg-[#ebe5ff] text-[#3814d4] rounded-lg"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#f1ebff] mt-2">
              <span className="text-[12px] font-bold text-[#e40468]">{selectedHost.social}</span>
              <button
                onClick={() => {
                  setSelectedHost(null)
                  onOpenRequestModal()
                }}
                className="text-[11px] font-extrabold px-3 py-1.5 bg-[#3814d4] text-white rounded-full"
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
