import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export function CampusWireScreen({
  events,
  lostAndFound,
  opportunities,
  alert,
  onAddLostFound,
}) {
  const [filterTab, setFilterTab] = useState('all') // 'all' | 'events' | 'lost' | 'opportunities'
  const [isLostFoundModalOpen, setIsLostFoundModalOpen] = useState(false)
  const [lfItem, setLfItem] = useState('')
  const [lfLocation, setLfLocation] = useState('')
  const [lfContact, setLfContact] = useState('')

  const handleReportLostFound = (e) => {
    e.preventDefault()
    if (!lfItem.trim()) return

    onAddLostFound({
      item: lfItem.trim(),
      location: lfLocation.trim() || 'Found on Campus',
      contact: lfContact.trim() || 'Contact MESCE Radio Desk / Security',
      date: 'Just now',
      claimed: false,
    })

    confetti({ particleCount: 20, spread: 40 })
    setIsLostFoundModalOpen(false)
    setLfItem('')
    setLfLocation('')
    setLfContact('')
  }

  const unclaimedLostCount = lostAndFound.filter((l) => !l.claimed).length
  const totalCount = events.length + unclaimedLostCount + opportunities.length

  const categories = [
    {
      id: 'all',
      title: 'All Wire',
      subtitle: `${totalCount} updates`,
      icon: 'layers',
      bgClass: 'bg-gradient-to-br from-[#9b67db] to-[#8652cb]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(150, 98, 213, 0.4)',
      count: totalCount,
    },
    {
      id: 'events',
      title: 'Fest & Clubs',
      subtitle: `${events.length} events`,
      icon: 'add_comment',
      bgClass: 'bg-gradient-to-br from-[#53df6d] to-[#3ece58]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(79, 219, 106, 0.4)',
      count: events.length,
    },
    {
      id: 'lost',
      title: 'Lost & Found',
      subtitle: `${unclaimedLostCount} unclaimed`,
      icon: 'location_on',
      bgClass: 'bg-gradient-to-br from-[#9ebaa2] to-[#86a58d]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(157, 185, 163, 0.4)',
      count: unclaimedLostCount,
    },
    {
      id: 'opportunities',
      title: 'Internships & Contests',
      subtitle: `${opportunities.length} openings`,
      icon: 'timer',
      bgClass: 'bg-gradient-to-br from-[#ff9575] to-[#f97350]',
      hoverClass: 'hover:brightness-105',
      glowColor: 'rgba(255, 147, 115, 0.4)',
      count: opportunities.length,
    },
  ]

  const handleCategorySelect = (id) => {
    if (filterTab === id && id !== 'all') {
      setFilterTab('all')
    } else {
      setFilterTab(id)
    }
  }

  return (
    <div className="flex flex-col w-full pb-8">
      {/* 2x2 Category Box Grid (iOS Shortcuts Style) */}
      <div className="px-4 pt-3 pb-2">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((box) => {
            const isActive = filterTab === box.id
            return (
              <button
                key={box.id}
                onClick={() => handleCategorySelect(box.id)}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-[22px] text-left transition-all duration-200 cursor-pointer select-none overflow-hidden min-h-[104px] ${
                  box.bgClass
                } ${box.hoverClass} ${
                  isActive
                    ? 'ring-[3.5px] ring-white shadow-xl scale-[1.02]'
                    : filterTab !== 'all'
                    ? 'opacity-80 hover:opacity-100 hover:scale-[1.01] shadow-md'
                    : 'hover:scale-[1.01] shadow-md'
                }`}
                style={{
                  boxShadow: isActive
                    ? `0 12px 24px -4px ${box.glowColor}, 0 6px 12px -2px rgba(0, 0, 0, 0.12)`
                    : '0 4px 14px 0 rgba(0, 0, 0, 0.08)',
                }}
              >
                {/* Top: Icon & Indicator */}
                <div className="flex items-start justify-between w-full">
                  <span className="material-symbols-outlined text-white text-[28px] drop-shadow-sm select-none">
                    {box.icon}
                  </span>
                  {isActive ? (
                    <div className="w-5 h-5 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white shadow-xs">
                      <span className="material-symbols-outlined text-[13px] font-black">check</span>
                    </div>
                  ) : box.count > 0 ? (
                    <span className="px-2 py-0.5 rounded-full bg-black/15 text-white/95 text-[10px] font-bold backdrop-blur-xs">
                      {box.count}
                    </span>
                  ) : null}
                </div>

                {/* Bottom: Title & Subtitle */}
                <div className="mt-3">
                  <h4 className="text-white text-[15px] sm:text-[16px] font-bold leading-tight drop-shadow-sm">
                    {box.title}
                  </h4>
                  <p className="text-white/80 text-[11px] font-medium leading-tight mt-0.5 truncate">
                    {box.subtitle}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Filter Reset pill when filtered */}
        {filterTab !== 'all' && (
          <div className="flex items-center justify-between mt-2.5 px-1 text-[11px]">
            <span className="text-[#474556] font-semibold">
              Showing <span className="font-extrabold text-[#1c163b]">{categories.find((c) => c.id === filterTab)?.title}</span>
            </span>
            <button
              onClick={() => setFilterTab('all')}
              className="text-[#3814d4] font-extrabold hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <span>Reset filter</span>
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}
      </div>

      {/* Emergency Official Alert (if active) */}
      {alert?.active && (filterTab === 'all' || filterTab === 'events') && (
        <div className="px-4 mt-2">
          <div className="bg-[#fff0f4] border border-[#ffb1c1] rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <span className="material-symbols-outlined text-[#e40468] text-[24px] shrink-0 mt-0.5 animate-pulse">
              emergency_home
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#e40468] text-white px-2 py-0.5 rounded-full">
                  URGENT CAMPUS NOTICE
                </span>
                <span className="text-[10px] text-[#90003e] font-bold">{alert.timestamp}</span>
              </div>
              <h4 className="text-[14px] font-extrabold text-[#3f0017] mt-1">{alert.title}</h4>
              <p className="text-[12px] text-[#7a1c38] mt-0.5 leading-snug">{alert.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: College Fest & Club Events */}
      {(filterTab === 'all' || filterTab === 'events') && (
        <div className="px-4 mt-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1c163b]">Festivals & Club Events</h3>
              <p className="text-[11px] text-[#474556]">Official calendar of MES College of Engineering</p>
            </div>
            <span className="material-symbols-outlined text-[#3814d4] text-[20px]">
              event_upcoming
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-2xl bg-white border border-[#e6deff]/60 shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${ev.badgeColor}`}
                    >
                      {ev.badge}
                    </span>
                    <h4 className="text-[15px] font-black text-[#1c163b] mt-1 leading-snug">
                      {ev.title}
                    </h4>
                    <p className="text-[11px] text-[#3814d4] font-bold mt-0.5">{ev.club}</p>
                  </div>
                </div>

                <p className="text-[12px] text-[#474556] leading-relaxed">{ev.desc}</p>

                <div className="bg-[#f7f1ff] p-2.5 rounded-xl flex items-center justify-between text-[11px] font-bold text-[#1c163b]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#3814d4]">
                      calendar_month
                    </span>
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#474556]">
                    <span className="material-symbols-outlined text-[16px] text-[#e40468]">
                      location_on
                    </span>
                    <span className="truncate max-w-[150px]">{ev.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Lost & Found Board */}
      {(filterTab === 'all' || filterTab === 'lost') && (
        <div className="px-4 mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1c163b]">Campus Lost & Found</h3>
              <p className="text-[11px] text-[#474556]">Broadcasting lost items on MESCE FM 108.1</p>
            </div>
            <button
              onClick={() => setIsLostFoundModalOpen(true)}
              className="px-3 py-1.5 bg-[#3814d4] text-white text-[11px] font-extrabold rounded-full shadow-sm flex items-center gap-1 hover:bg-[#2400a0] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>Report Item</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5">
            {lostAndFound.map((lf) => (
              <div
                key={lf.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  lf.claimed
                    ? 'bg-[#f8f8fa] border-[#e6deff]/40 opacity-70'
                    : 'bg-white border-[#e6deff]/60 shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#f1ebff] text-[#3814d4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    {lf.claimed ? 'check_circle' : 'search'}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[13px] font-extrabold text-[#1c163b] truncate">{lf.item}</h4>
                    {lf.claimed ? (
                      <span className="px-1.5 py-0.2 rounded bg-green-100 text-green-700 text-[9px] font-bold">
                        Claimed
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                        Unclaimed
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#474556] truncate mt-0.5">{lf.location}</p>
                  <p className="text-[10px] text-[#3814d4] font-semibold mt-0.5">
                    Contact: {lf.contact} • {lf.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Internships, Competitions & Opportunities */}
      {(filterTab === 'all' || filterTab === 'opportunities') && (
        <div className="px-4 mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1c163b]">Student Opportunities</h3>
              <p className="text-[11px] text-[#474556]">Internships, hackathons & student challenges</p>
            </div>
            <span className="material-symbols-outlined text-[#e40468] text-[20px]">
              work
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-2xl bg-white border border-[#e6deff]/60 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-[14px] font-black text-[#1c163b]">{opp.title}</h4>
                    <p className="text-[11px] text-[#3814d4] font-bold mt-0.5">{opp.org}</p>
                  </div>
                  <span className="text-[11px] font-black text-[#e40468] bg-[#ffd9df] px-2 py-0.5 rounded-full whitespace-nowrap">
                    {opp.stipend}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 my-1">
                  {opp.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f1ebff] text-[#474556]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f1ebff] text-[11px]">
                  <span className="text-[#777587] font-semibold">Deadline: {opp.deadline}</span>
                  <span className="text-[#3814d4] font-black flex items-center">
                    {opp.link} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Report Lost or Found Item */}
      {isLostFoundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-3 relative">
            <button
              onClick={() => setIsLostFoundModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#3814d4] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">find_in_page</span>
              </div>
              <div>
                <h3 className="text-[17px] font-black text-[#1c163b]">Report Item</h3>
                <p className="text-[11px] text-[#474556]">Will be broadcasted on campus radio</p>
              </div>
            </div>

            <form onSubmit={handleReportLostFound} className="flex flex-col gap-2.5 mt-1">
              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Item Name & Brand *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Casio fx-991EX Calculator / Blue Umbrella"
                  value={lfItem}
                  onChange={(e) => setLfItem(e.target.value)}
                  className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Location Found / Lost</label>
                <input
                  type="text"
                  placeholder="e.g. Mech Seminar Hall / Central Library 2nd Floor"
                  value={lfLocation}
                  onChange={(e) => setLfLocation(e.target.value)}
                  className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#474556] block mb-1">Contact / Handover Location</label>
                <input
                  type="text"
                  placeholder="e.g. Handed over to Security Gate / My Phone"
                  value={lfContact}
                  onChange={(e) => setLfContact(e.target.value)}
                  className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#3814d4]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#3814d4] hover:bg-[#2400a0] text-white font-extrabold text-[13px] shadow-md transition-all cursor-pointer mt-1 active:scale-98"
              >
                Post to Campus Wire & Radio Desk
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
