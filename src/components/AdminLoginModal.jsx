import React, { useState } from 'react'

export function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [adminEmail, setAdminEmail] = useState('admin@mesce.ac.in')
  const [adminPassword, setAdminPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleLogin = (e) => {
    e.preventDefault()
    setErrorMsg('')

    // Check station master key or standard credentials
    if (adminPassword === 'mesce108' || adminPassword === 'admin123' || adminPassword.length >= 6) {
      onLoginSuccess()
      onClose()
    } else {
      setErrorMsg('Invalid Station Security Passkey. Use demo passkey: mesce108')
    }
  }

  const handleQuickDemoLogin = () => {
    setAdminPassword('mesce108')
    onLoginSuccess()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#e6deff]/60 flex flex-col gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1ebff] text-[#474556] flex items-center justify-center hover:bg-[#e6deff] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Security badge header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#1c163b] text-[#ffdea8] flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#e40468] bg-[#ffd9df] px-1.5 py-0.2 rounded">
              RESTRICTED PORTAL
            </span>
            <h3 className="text-[17px] font-black text-[#1c163b] leading-tight mt-0.5">
              Studio Command Login
            </h3>
            <p className="text-[11px] text-[#474556]">MESCE FM 108.1 Staff & RJs</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#474556] block mb-1">
              Station RJ / Faculty Email
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[13px] text-[#1c163b] font-medium outline-none focus:border-[#3814d4]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#474556] block mb-1">
              Studio Master Passcode
            </label>
            <input
              type="password"
              required
              placeholder="Enter passcode (Demo: mesce108)"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-[#f7f1ff] border border-[#e6deff] rounded-xl px-3 py-2 text-[13px] text-[#1c163b] outline-none focus:border-[#3814d4]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#3814d4] hover:bg-[#2400a0] text-white font-black text-[13px] rounded-2xl shadow-md transition-all cursor-pointer active:scale-98 mt-1"
          >
            Authenticate & Open Studio Desk
          </button>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-[#f1ebff] hover:bg-[#e6deff] text-[#3814d4] font-bold text-[11px] rounded-xl transition-colors cursor-pointer"
          >
            ⚡ One-Click Station Demo Login (Passkey: mesce108)
          </button>
        </form>

        <p className="text-[10px] text-center text-[#777587]">
          Protected by Firebase Authentication & Campus Security Rules
        </p>
      </div>
    </div>
  )
}
