import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export function DiscoverScreen({
  spotlight,
  playlists,
  onPlayTrack,
  onSavePlaylist,
  savedPlaylists,
  onSubmitMusic,
}) {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [trackName, setTrackName] = useState('')
  const [artistName, setArtistName] = useState('')
  const [genre, setGenre] = useState('Indie Acoustic')
  const [trackLink, setTrackLink] = useState('')
  const [trackNotes, setTrackNotes] = useState('')

  const handleMusicSubmit = (e) => {
    e.preventDefault()
    if (!trackName.trim()) return

    onSubmitMusic({
      title: trackName.trim(),
      artist: artistName.trim() || 'Student Artist',
      genre,
      link: trackLink.trim(),
      notes: trackNotes.trim(),
      submittedAt: 'Just now',
    })

    confetti({ particleCount: 35, spread: 60 })
    setIsSubmitModalOpen(false)
    setTrackName('')
    setArtistName('')
    setTrackLink('')
    setTrackNotes('')
    alert('Track submitted successfully! The MESCE FM Music Director and DJs will review it for on-air rotation.')
  }

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. Track of the Week & Student Artist Spotlight Hero */}
      <div className="px-4 pt-2">
        <div className="relative overflow-hidden rounded-[28px] bg-[#1c1c1e] text-white p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] border border-white/[0.08]">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ff7a00]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] font-black text-[10px] uppercase tracking-wider border border-[#ff7a00]/30">
                <span className="material-symbols-outlined text-[13px]">hotel_class</span>
                TRACK OF THE WEEK
              </span>
              <span className="text-[11px] font-bold text-white/60">{spotlight.plays} Campus Streams</span>
            </div>

            <div className="flex items-center gap-3.5 mt-1">
              <img
                src={spotlight.cover}
                alt={spotlight.artistName}
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white/10 shadow-md shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'
                }}
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                  CAMPUS ARTIST SPOTLIGHT
                </span>
                <h3 className="text-[17px] font-black text-white leading-tight truncate mt-0.5">
                  {spotlight.trackTitle}
                </h3>
                <p className="text-[13px] font-bold text-[#ff7a00] truncate mt-0.5">
                  {spotlight.artistName}
                </p>
                <p className="text-[10px] text-white/60 truncate mt-0.5">{spotlight.genre}</p>
              </div>
            </div>

            <p className="text-[11px] text-white/70 leading-relaxed mt-1">{spotlight.bio}</p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
              <div className="flex -space-x-1.5 overflow-hidden">
                {spotlight.members.map((m, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-[#2c2c2e] text-[9px] font-bold text-white px-2 py-0.5 rounded-full ring-1 ring-white/10"
                  >
                    {m.split(' ')[0]}
                  </span>
                ))}
              </div>

              <button
                onClick={() =>
                  onPlayTrack({
                    title: spotlight.trackTitle,
                    artist: spotlight.artistName,
                    album: 'Track of the Week',
                  })
                }
                className="px-4 py-2 bg-[#ff7a00] hover:bg-[#ff8c1a] text-black rounded-full text-[12px] font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                <span>Play Track</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Submit Original Music CTA */}
      <div className="px-4 mt-5">
        <div className="bg-[#1c1c1e] border border-white/[0.08] rounded-[24px] p-4 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2c2c2e] text-[#ff7a00] border border-white/5 flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </div>
            <div>
              <h4 className="text-[13px] font-black text-white">Are You a Student Musician?</h4>
              <p className="text-[11px] text-white/60">
                Submit your original songs or beat drops for airplay on 108.1 FM.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-3.5 py-2 rounded-full bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-extrabold text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            Submit Music
          </button>
        </div>
      </div>

      {/* 3. Curated Playlists by Campus DJs */}
      <div className="px-4 mt-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-extrabold text-neutral-900">Student & DJ Playlists</h3>
            <p className="text-[11px] text-neutral-500">Curated tapes for studying, chai breaks & hostel nights</p>
          </div>
          <span className="text-[11px] text-[#ff7a00] font-bold">See All</span>
        </div>

        <div className="flex flex-col gap-3">
          {playlists.map((pl) => {
            const isSaved = savedPlaylists?.includes(pl.id)
            return (
              <div
                key={pl.id}
                className="p-3.5 rounded-[24px] bg-[#1c1c1e] border border-white/[0.08] shadow-md hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
              >
                <img
                  src={pl.cover}
                  alt={pl.title}
                  className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm border border-white/5"
                  onError={(e) => {
                    e.currentTarget.onerror = null
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80'
                  }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-[#ff7a00] font-mono">
                      {pl.tracksCount} Tracks
                    </span>
                    <span className="text-[10px] text-white/40">• {pl.duration}</span>
                  </div>
                  <h4 className="text-[14px] font-black text-white truncate mt-0.5">
                    {pl.title}
                  </h4>
                  <p className="text-[11px] text-white/60 truncate mt-0.5">
                    Curated by {pl.curator}
                  </p>
                  <div className="flex gap-1.5 mt-1">
                    {pl.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#242426] text-white/70 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onSavePlaylist(pl.id)}
                    aria-label="Save playlist"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                      isSaved
                        ? 'text-[#ff3b30]'
                        : 'text-white/40 hover:text-[#ff3b30] hover:bg-white/5'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>

                  <button
                    onClick={() =>
                      onPlayTrack({
                        title: pl.title,
                        artist: pl.curator,
                        album: 'Campus Curated Playlist',
                      })
                    }
                    aria-label={`Play ${pl.title}`}
                    className="w-9 h-9 rounded-full bg-[#2c2c2e] text-white group-hover:bg-[#ff7a00] group-hover:text-black flex items-center justify-center transition-all cursor-pointer border border-white/5"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      play_arrow
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Recently Played On Air */}
      <div className="px-4 mt-6 flex flex-col gap-2.5">
        <h3 className="text-[16px] font-extrabold text-neutral-900">Recently Broadcasted Tracks</h3>
        <div className="bg-[#1c1c1e] rounded-[24px] border border-white/[0.08] p-3 shadow-md flex flex-col gap-2">
          {[
            { title: 'Kaantha (Live Jam)', artist: 'Masala Coffee', time: '12:20 PM' },
            { title: 'Vennilaave', artist: 'Sushin Shyam & Neha Nair', time: '12:12 PM' },
            { title: 'The Breakup Song (Acoustic)', artist: 'MESCE Student Solo', time: '12:02 PM' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[12px] py-1 border-b border-white/5 last:border-none"
            >
              <div className="min-w-0 pr-2">
                <span className="font-extrabold text-white block truncate">{item.title}</span>
                <span className="text-[11px] text-white/60 truncate">{item.artist}</span>
              </div>
              <span className="text-[10px] text-white/40 font-mono shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Submit Original Music */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-[#1c1c1e] text-white border border-white/[0.08] rounded-[28px] p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#2c2c2e] border border-white/10 text-[#ff7a00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">music_note</span>
              </div>
              <div>
                <h3 className="text-[17px] font-black text-white">Submit Original Track</h3>
                <p className="text-[11px] text-white/60">For MESCE FM 108.1 Airplay</p>
              </div>
            </div>

            <form onSubmit={handleMusicSubmit} className="flex flex-col gap-2.5 mt-1">
              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Track Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monsoon Memories / Canteen Rap"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Artist / Band Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amal & Sneha (ECE / Arch)"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                >
                  <option value="Indie Acoustic">Indie Acoustic</option>
                  <option value="Malayalam Rap / Hip-Hop">Malayalam Rap / Hip-Hop</option>
                  <option value="Campus Rock Band">Campus Rock Band</option>
                  <option value="Lo-Fi / Electronic">Lo-Fi / Electronic</option>
                  <option value="Classical / Instrumental">Classical / Instrumental</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Audio / Drive / YouTube Link</label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/... or soundcloud"
                  value={trackLink}
                  onChange={(e) => setTrackLink(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/60 block mb-1">Notes / Lyrics Story</label>
                <textarea
                  rows="2"
                  placeholder="Tell us what inspired this song..."
                  value={trackNotes}
                  onChange={(e) => setTrackNotes(e.target.value)}
                  className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[#ff7a00]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-extrabold text-[13px] shadow-md transition-all cursor-pointer mt-1 active:scale-98"
              >
                Send to Radio Programming Team
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
