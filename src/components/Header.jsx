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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-xl pt-safe shadow-[0_2px_14px_rgba(0,0,0,0.06)] border-b border-black/[0.06]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1c1c1e] border border-white/10 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px] text-[#ff7a00]">radio</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-black text-neutral-900 leading-tight tracking-tight">
                MESCE FM
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#ff7a00] text-black text-[10px] font-black tracking-wide">
                108.1
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider truncate max-w-[170px]">
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
            className="w-10 h-10 flex items-center justify-center rounded-full text-neutral-600 hover:text-black hover:bg-black/5 transition-all relative active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff7a00] ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={onOpenProfile}
            aria-label="Student Profile"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:ring-2 hover:ring-[#ff7a00] transition-all cursor-pointer"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full object-cover border border-[#ff7a00]/80 shadow-sm"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80'
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00d26a] ring-1 ring-white"></span>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
