import React, { useState } from 'react'

export function ProfileModal({ isOpen, onClose }) {
  const [hdAudio, setHdAudio] = useState(true)
  const [cellularData, setCellularData] = useState(true)
  const [offlineSync, setOfflineSync] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1c1e] border border-white/[0.08] text-white rounded-[28px] p-6 shadow-2xl flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-white">Student Listener Profile</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Student Card */}
        <div className="p-4 rounded-2xl bg-[#242426] border border-white/10 text-white flex items-center gap-3.5 shadow-md">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80"
              alt="Campus Listener"
              className="w-13 h-13 rounded-full object-cover border-2 border-[#ff7a00] shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80'
              }}
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00d26a] ring-2 ring-[#242426]"></span>
          </div>
          <div>
            <h4 className="text-[16px] font-extrabold leading-tight">Campus Listener</h4>
            <p className="text-[12px] text-white/60 mt-0.5">MES College of Engineering</p>
            <span className="inline-block px-2 py-0.5 rounded-full bg-[#ff7a00]/20 text-[#ff7a00] text-[10px] font-bold mt-1">
              STUDENT PASS
            </span>
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white">Campus HD Audio (320kbps)</span>
              <span className="text-[11px] text-white/50">Studio master stream quality</span>
            </div>
            <button
              onClick={() => setHdAudio(!hdAudio)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                hdAudio ? 'bg-[#ff7a00]' : 'bg-[#2c2c2e]'
              }`}
            >
              <span
                className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  hdAudio ? 'right-1' : 'left-1'
                }`}
              ></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white">Stream on Campus Wi-Fi / 5G</span>
              <span className="text-[11px] text-white/50">High bitrate playback allowed</span>
            </div>
            <button
              onClick={() => setCellularData(!cellularData)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                cellularData ? 'bg-[#ff7a00]' : 'bg-[#2c2c2e]'
              }`}
            >
              <span
                className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  cellularData ? 'right-1' : 'left-1'
                }`}
              ></span>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white">Offline Podcast Cache</span>
              <span className="text-[11px] text-white/50">Buffer recent campus interviews</span>
            </div>
            <button
              onClick={() => setOfflineSync(!offlineSync)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                offlineSync ? 'bg-[#ff7a00]' : 'bg-[#2c2c2e]'
              }`}
            >
              <span
                className={`absolute top-1 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${
                  offlineSync ? 'right-1' : 'left-1'
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Modal Action */}
        <div className="pt-2 border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#242426] hover:bg-[#2c2c2e] text-white font-bold text-xs rounded-2xl border border-white/5 transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  )
}
