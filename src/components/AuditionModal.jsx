import React, { useState } from 'react'
import confetti from 'canvas-confetti'

export function AuditionModal({ isOpen, onClose, onSubmitAudition }) {
  const [applicantName, setApplicantName] = useState('')
  const [dept, setDept] = useState('')
  const [showConcept, setShowConcept] = useState('')
  const [preferredTime, setPreferredTime] = useState('Friday Evenings')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!applicantName.trim() || !showConcept.trim()) return

    onSubmitAudition({
      applicantName: applicantName.trim(),
      dept: dept.trim() || 'MESCE Student',
      showConcept: showConcept.trim(),
      preferredTime,
      sampleVoiceClip: 'Audio sample uploaded (1:00 min)',
      status: 'Under Review',
      submittedAt: 'Just now',
    })

    confetti({ particleCount: 35, spread: 60 })
    onClose()
    setApplicantName('')
    setDept('')
    setShowConcept('')
    alert('Application submitted! The Station Director & Faculty Coordinator will review your audition pitch.')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-3 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff]"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#e40468] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">mic</span>
          </div>
          <div>
            <h3 className="text-[17px] font-black text-[#1c163b]">RJ & Host Audition</h3>
            <p className="text-[11px] text-[#474556]">Pitch your show on MESCE FM 108.1</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 mt-1">
          <div>
            <label className="text-[11px] font-bold text-[#474556] block mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Farhan / Ananya"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#e40468]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#474556] block mb-1">Department & Semester *</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science, Year 3"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#e40468]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#474556] block mb-1">Preferred Broadcast Time</label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[12px] text-[#1c163b] outline-none focus:border-[#e40468]"
            >
              <option value="Morning Labs (8:30 AM – 9:30 AM)">Morning Labs (8:30 AM – 9:30 AM)</option>
              <option value="Canteen Break (12:30 PM – 2:00 PM)">Canteen Break (12:30 PM – 2:00 PM)</option>
              <option value="Sunset Hour (5:00 PM – 6:30 PM)">Sunset Hour (5:00 PM – 6:30 PM)</option>
              <option value="Night Jam (8:00 PM – 10:00 PM)">Night Jam (8:00 PM – 10:00 PM)</option>
              <option value="Weekend Special (Saturday / Sunday)">Weekend Special (Saturday / Sunday)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#474556] block mb-1">Show Pitch / Concept *</label>
            <textarea
              required
              rows="3"
              placeholder="Tell us what your show will be about, the music genre, campus topics or guest interviews..."
              value={showConcept}
              onChange={(e) => setShowConcept(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl p-2.5 text-[12px] text-[#1c163b] outline-none focus:border-[#e40468]"
            ></textarea>
          </div>

          <div className="text-[10px] text-[#777587]">
            🎙️ Selected applicants will be called to the MESCE FM studio for a 5-minute pilot recording session.
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#e40468] hover:bg-[#b70051] text-white font-black text-[13px] shadow-md transition-all cursor-pointer mt-1 active:scale-98"
          >
            Submit RJ Application
          </button>
        </form>
      </div>
    </div>
  )
}
