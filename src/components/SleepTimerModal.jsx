import React from 'react'

export function SleepTimerModal({ isOpen, onClose, activeMinutes, onSetTimer }) {
  if (!isOpen) return null

  const options = [15, 30, 45, 60, 90]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1c1e] border border-white/[0.08] text-white rounded-[28px] p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff7a00]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#2c2c2e] border border-white/10 text-[#ff7a00] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">alarm</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sleep Timer</h3>
              <p className="text-xs text-white/50">Auto stop radio playback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {activeMinutes && (
          <div className="bg-[#242426] border border-[#ff7a00]/30 p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a00] animate-pulse"></span>
              <span className="text-sm font-bold text-white">Timer is active:</span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 bg-[#ff7a00] text-black rounded-full">
              {activeMinutes} mins left
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2.5 my-2">
          {options.map((mins) => (
            <button
              key={mins}
              onClick={() => {
                onSetTimer(mins)
                onClose()
              }}
              className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                activeMinutes === mins
                  ? 'bg-[#ff7a00] text-black border-[#ff7a00] shadow-md scale-105'
                  : 'bg-[#242426] text-white border-white/5 hover:bg-[#2c2c2e]'
              }`}
            >
              <span className="text-base font-extrabold">{mins}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-70">mins</span>
            </button>
          ))}

          <button
            onClick={() => {
              onSetTimer(null)
              onClose()
            }}
            className="py-3 px-2 rounded-2xl font-bold text-xs bg-red-950/40 text-red-400 border border-red-500/20 hover:bg-red-900/40 transition-colors flex flex-col items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">timer_off</span>
            <span>Turn Off</span>
          </button>
        </div>
      </div>
    </div>
  )
}
