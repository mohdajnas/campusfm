import React, { useState } from 'react'

export function Header({
  currentScreen,
  onOpenNotifications,
  onOpenProfile,
  isAdminActive,
}) {
  const [notificationCount, setNotificationCount] = useState(1)

  const getSubTitle = () => {
    switch (currentScreen) {
      case 'on-air':
        return 'Campus Live & Shows'
      case 'community':
        return 'Listener Community'
      case 'wire':
        return 'Campus Wire & Notices'
      case 'discover':
        return 'Music & Spotlights'
      case 'admin':
        return 'Studio Control Console'
      case 'player':
        return 'Live Audio Stream'
      default:
        return 'MES College of Engineering'
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#fdf8ff]/90 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e6deff]/50">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2400a0] via-[#3814d4] to-[#e40468] p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full rounded-[14px] bg-[#3814d4] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[22px] text-white">radio</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-black text-[#3814d4] leading-tight tracking-tight">
                MESCE FM
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#e40468] text-white text-[10px] font-black tracking-wide">
                108.1
              </span>
            </div>
            <span className="text-[10px] text-[#474556] font-semibold uppercase tracking-wider truncate max-w-[170px]">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Right Action Icons (Purely student listener tools) */}
        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <button
            onClick={() => {
              setNotificationCount(0)
              if (onOpenNotifications) onOpenNotifications()
            }}
            aria-label="Campus Radio Alerts"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#474556] hover:text-[#3814d4] hover:bg-[#f1ebff] transition-all relative active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#e40468] ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onOpenProfile}
            aria-label="Student Profile"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#3814d4] transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3814d4] to-[#ffba20] p-0.5 shadow-sm">
              <div className="w-full h-full rounded-full bg-[#1c163b] flex items-center justify-center text-white font-extrabold text-[11px]">
                ME
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
