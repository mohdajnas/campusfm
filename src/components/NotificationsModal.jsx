import React from 'react'

export function NotificationsModal({ isOpen, onClose, onSelectStation, stations }) {
  if (!isOpen) return null

  const notifications = [
    {
      id: 1,
      title: 'Ryan Seacrest is On Air Now!',
      stationId: 'kiis-fm',
      time: '10m ago',
      desc: 'Top 40 countdown and live artist interview just started on KIIS-FM 102.7.',
      icon: 'podcasts',
      badge: 'LIVE',
    },
    {
      id: 2,
      title: 'Classic Rock Special Hour',
      stationId: 'kzoq',
      time: '25m ago',
      desc: "Guns N' Roses, Led Zeppelin & Queen feature hour on KZOQ Z100.",
      icon: 'music_note',
      badge: 'SPECIAL',
    },
    {
      id: 3,
      title: 'BBC Live Lounge Premiere',
      stationId: 'bbc-radio-1',
      time: '1h ago',
      desc: 'Exclusive new acoustic mix broadcast live from London.',
      icon: 'graphic_eq',
      badge: 'PREMIERE',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#e6deff]/60 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f1ebff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3814d4] text-[22px]">
              notifications
            </span>
            <h3 className="text-base font-extrabold text-[#1c163b]">Broadcast Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff]"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                const st = stations.find((s) => s.id === n.stationId)
                if (st) onSelectStation(st)
                onClose()
              }}
              className="p-3 rounded-2xl bg-[#f7f1ff] hover:bg-[#f1ebff] transition-colors cursor-pointer flex gap-3 items-start group"
            >
              <div className="w-9 h-9 rounded-full bg-[#3814d4] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-[13px] font-bold text-[#1c163b] truncate">{n.title}</h4>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#ffd9df] text-[#90003e]">
                    {n.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#474556] leading-snug mt-0.5">{n.desc}</p>
                <span className="text-[10px] text-[#777587] font-semibold mt-1 block">
                  {n.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
