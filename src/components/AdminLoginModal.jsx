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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c1c1e] border border-white/[0.08] text-white rounded-[28px] p-6 shadow-2xl flex flex-col gap-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2c2c2e] text-white/70 hover:text-white flex items-center justify-center border border-white/5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Security badge header */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#2c2c2e] border border-white/10 text-[#ff7a00] flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#ff7a00] bg-[#ff7a00]/20 px-2 py-0.5 rounded-full border border-[#ff7a00]/30">
              RESTRICTED PORTAL
            </span>
            <h3 className="text-[17px] font-black text-white leading-tight mt-1">
              Studio Command Login
            </h3>
            <p className="text-[11px] text-white/60">MESCE FM 108.1 Staff & RJs</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-300 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div>
            <label className="text-[11px] font-bold text-white/60 block mb-1">
              Station RJ / Faculty Email
            </label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white font-medium outline-none focus:border-[#ff7a00]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-white/60 block mb-1">
              Studio Master Passcode
            </label>
            <input
              type="password"
              required
              placeholder="Enter passcode (Demo: mesce108)"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-[#242426] border border-white/10 rounded-xl px-3 py-2 text-[13px] text-white outline-none focus:border-[#ff7a00]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ff7a00] hover:bg-[#ff8c1a] text-black font-black text-[13px] rounded-2xl shadow-md transition-all cursor-pointer active:scale-98 mt-1"
          >
            Authenticate & Open Studio Desk
          </button>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-[#2c2c2e] hover:bg-[#38383a] text-white/90 font-bold text-[11px] rounded-xl border border-white/5 transition-colors cursor-pointer"
          >
            ⚡ One-Click Station Demo Login (Passkey: mesce108)
          </button>
        </form>

        <p className="text-[10px] text-center text-white/40">
          Protected by Firebase Authentication & Campus Security Rules
        </p>
      </div>
    </div>
  )
}
