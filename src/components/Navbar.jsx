import React from 'react'

export function Navbar({ activeScreen, setActiveScreen }) {
  const tabs = [
    { id: 'on-air', label: 'On Air', icon: 'radio' },
    { id: 'community', label: 'Community', icon: 'forum' },
    { id: 'wire', label: 'Campus Wire', icon: 'campaign' },
    { id: 'discover', label: 'Discover', icon: 'library_music' },
  ]

  // If in standalone admin screen, do not show student navbar
  if (activeScreen === 'admin') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-[#fdf8ff]/95 backdrop-blur-xl border-t border-[#e6deff]/60 shadow-[0_-4px_24px_rgba(36,0,160,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeScreen === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreen(tab.id)}
              className={`flex flex-col items-center justify-center w-18 h-12 transition-all relative group cursor-pointer ${
                isActive
                  ? 'text-[#3814d4] font-extrabold'
                  : 'text-[#474556] hover:text-[#3814d4] font-medium'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[24px] transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'filled' : ''
                  }`}
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1, 'wght' 600" }
                      : { fontVariationSettings: "'FILL' 0, 'wght' 400" }
                  }
                >
                  {tab.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#3814d4] rounded-full"></span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
