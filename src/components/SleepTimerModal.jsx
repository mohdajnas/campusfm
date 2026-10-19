import React from 'react'

export function SleepTimerModal({ isOpen, onClose, activeMinutes, onSetTimer }) {
  if (!isOpen) return null

  const options = [15, 30, 45, 60, 90]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e6deff] rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#f1ebff] text-[#3814d4] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">alarm</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1c163b]">Sleep Timer</h3>
              <p className="text-xs text-[#474556]">Auto stop radio playback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {activeMinutes && (
          <div className="bg-[#f7f1ff] border border-[#c5c0ff] p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e40468] animate-pulse"></span>
              <span className="text-sm font-bold text-[#3814d4]">Timer is active:</span>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 bg-[#3814d4] text-white rounded-full">
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
              className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                activeMinutes === mins
                  ? 'bg-[#3814d4] text-white shadow-md scale-105'
                  : 'bg-[#f7f1ff] text-[#1c163b] hover:bg-[#e6deff]'
              }`}
            >
              <span className="text-base font-extrabold">{mins}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-80">mins</span>
            </button>
          ))}

          <button
            onClick={() => {
              onSetTimer(null)
              onClose()
            }}
            className="py-3 px-2 rounded-2xl font-bold text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex flex-col items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">timer_off</span>
            <span>Turn Off</span>
          </button>
        </div>
      </div>
    </div>
  )
}
