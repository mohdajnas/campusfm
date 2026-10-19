import React, { useState } from 'react'

export function ProfileModal({ isOpen, onClose, onOpenAdminLogin }) {
  const [hdAudio, setHdAudio] = useState(true)
  const [cellularData, setCellularData] = useState(true)
  const [offlineSync, setOfflineSync] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#e6deff]/60 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-[#1c163b]">Student Listener Profile</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Student Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#3814d4] to-[#2400a0] text-white flex items-center gap-3.5 shadow-md">
          <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#ffdea8] to-[#ff2a7a] p-0.5 shadow">
            <div className="w-full h-full rounded-full bg-[#1c163b] flex items-center justify-center text-white font-black text-sm">
              ME
            </div>
          </div>
          <div>
            <h4 className="text-[16px] font-extrabold leading-tight">Campus Listener</h4>
            <p className="text-[12px] text-[#c5c0ff] mt-0.5">MES College of Engineering</p>
            <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold mt-1">
              STUDENT PASS
            </span>
          </div>
        </div>

        {/* Settings Toggles */}
        <div className="flex flex-col gap-3 py-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#1c163b]">Campus HD Audio (320kbps)</span>
              <span className="text-[11px] text-[#474556]">Studio master stream quality</span>
            </div>
            <button
              onClick={() => setHdAudio(!hdAudio)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                hdAudio ? 'bg-[#3814d4]' : 'bg-[#e6deff]'
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
              <span className="text-[13px] font-bold text-[#1c163b]">Stream on Campus Wi-Fi / 5G</span>
              <span className="text-[11px] text-[#474556]">High bitrate playback allowed</span>
            </div>
            <button
              onClick={() => setCellularData(!cellularData)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                cellularData ? 'bg-[#3814d4]' : 'bg-[#e6deff]'
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
              <span className="text-[13px] font-bold text-[#1c163b]">Offline Podcast Cache</span>
              <span className="text-[11px] text-[#474556]">Buffer recent campus interviews</span>
            </div>
            <button
              onClick={() => setOfflineSync(!offlineSync)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                offlineSync ? 'bg-[#3814d4]' : 'bg-[#e6deff]'
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

        {/* Discrete Station Staff / Faculty Link */}
        <div className="pt-2 border-t border-[#f1ebff] flex flex-col gap-2">
          <button
            onClick={() => {
              onClose()
              if (onOpenAdminLogin) onOpenAdminLogin()
            }}
            className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#777587] hover:text-[#3814d4] transition-colors py-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Studio Staff & RJ Portal Login</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#f1ebff] hover:bg-[#e6deff] text-[#3814d4] font-bold text-xs rounded-2xl transition-colors cursor-pointer"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  )
}
