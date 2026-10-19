import React, { useState } from 'react'

export function EqualizerModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const [preset, setPreset] = useState('Bass Boost')
  const [bands, setBands] = useState({
    '60Hz': 6,
    '250Hz': 3,
    '1kHz': 0,
    '4kHz': 2,
    '12kHz': 5,
  })

  const presets = {
    Flat: { '60Hz': 0, '250Hz': 0, '1kHz': 0, '4kHz': 0, '12kHz': 0 },
    'Bass Boost': { '60Hz': 7, '250Hz': 4, '1kHz': 0, '4kHz': 1, '12kHz': 3 },
    Vocal: { '60Hz': -2, '250Hz': 1, '1kHz': 5, '4kHz': 4, '12kHz': 2 },
    Rock: { '60Hz': 5, '250Hz': 3, '1kHz': -1, '4kHz': 4, '12kHz': 6 },
    Electronic: { '60Hz': 6, '250Hz': 5, '1kHz': 1, '4kHz': 3, '12kHz': 7 },
  }

  const handleSelectPreset = (p) => {
    setPreset(p)
    if (presets[p]) {
      setBands(presets[p])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#f1ebff] text-[#3814d4] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">equalizer</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1c163b]">Graphic Equalizer</h3>
              <p className="text-xs text-[#474556]">Acoustic fine tuning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Preset chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {Object.keys(presets).map((p) => (
            <button
              key={p}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                preset === p
                  ? 'bg-[#3814d4] text-white shadow-sm'
                  : 'bg-[#f7f1ff] text-[#474556] hover:bg-[#e6deff]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Frequency sliders */}
        <div className="bg-[#f7f1ff] p-4 rounded-2xl flex justify-between items-center h-44">
          {Object.entries(bands).map(([hz, val]) => (
            <div key={hz} className="flex flex-col items-center justify-between h-full w-10">
              <span className="text-[10px] font-bold text-[#3814d4]">
                {val > 0 ? `+${val}` : val}dB
              </span>
              <div className="relative h-24 flex items-center justify-center">
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={val}
                  onChange={(e) => {
                    setBands((prev) => ({ ...prev, [hz]: parseInt(e.target.value) }))
                    setPreset('Custom')
                  }}
                  className="w-24 h-2 accent-[#3814d4] -rotate-90 appearance-none bg-[#e6deff] rounded-full cursor-pointer"
                />
              </div>
              <span className="text-[10px] font-bold text-[#474556]">{hz}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#3814d4] text-white font-bold rounded-2xl shadow-md active:scale-98 transition-transform cursor-pointer"
        >
          Apply Audio Profile
        </button>
      </div>
    </div>
  )
}
