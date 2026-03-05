"use client";

import React, { useState, useEffect } from 'react';

export default function DevelopmentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  // State untuk checkbox "Jangan tampilkan lagi"
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Cek apakah user sudah pernah MENCENTANG untuk tidak menampilkan popup
    const hasSeenPopup = localStorage.getItem('animaple_dev_popup_acknowledged');
    
    // Jika belum ada data di localStorage, tampilkan popup
    if (!hasSeenPopup) {
      // Delay sedikit agar animasinya enak dilihat saat load
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // HANYA simpan ke localStorage JIKA user mencentang checkbox
    if (dontShowAgain) {
      localStorage.setItem('animaple_dev_popup_acknowledged', 'true');
    }
  };

  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300">
      
      {/* MAGISNYA DI SINI: Efek Glassmorphism ala Navbar (bg transparan + backdrop blur) */}
      <div className="w-full max-w-[420px] bg-[#0A0A0A]/80 backdrop-blur-xl border border-[#2A2A2E]/80 rounded-2xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden">
        
        {/* Hiasan Background Glow */}
        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-yellow-500/10 blur-[60px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col items-center text-center">
          
          {/* Icon Warning Keren */}
          <div className="w-12 h-12 rounded-full bg-[#141414]/80 border border-[#2A2A2E] flex items-center justify-center mb-5 shadow-inner">
             <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
          </div>

          {/* Judul & Deskripsi */}
          <h2 className="text-xl font-bold text-white mb-3">Status Pengembangan</h2>
          <div className="space-y-3 text-[13px] sm:text-[14px] text-[#8C8C8C] leading-relaxed mb-6">
            <p>
              Website <strong>Animaple</strong> saat ini masih dalam tahap <span className="text-yellow-500 font-medium">BETA Development</span>.
            </p>
            <p>
              Anda mungkin akan menjumpai <i>bug</i>, error, atau fitur yang belum sempurna. Kami sedang bekerja keras melakukan perbaikan dan peningkatan sistem setiap harinya.
            </p>
          </div>

          {/* Badges Kontribusi */}
          <div className="w-full flex flex-col gap-2 mb-6">
            <p className="text-[11px] font-bold text-[#555] uppercase tracking-wider mb-1">
              Tertarik Kontribusi / Lapor Bug?
            </p>
            
            <div className="flex items-center justify-center gap-3">
                {/* Email Badge */}
                <a 
                  href="mailto:animaplexyz@gmail.com"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414]/80 hover:bg-[#1A1A1C] border border-[#2A2A2E] transition-colors group"
                >
                  <svg className="w-4 h-4 text-[#8C8C8C] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-xs font-medium text-[#8C8C8C] group-hover:text-white">Email</span>
                </a>

                {/* Github Badge */}
                <a 
                  href="https://github.com/animaplexyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414]/80 hover:bg-[#1A1A1C] border border-[#2A2A2E] transition-colors group"
                >
                  <svg className="w-4 h-4 text-[#8C8C8C] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  <span className="text-xs font-medium text-[#8C8C8C] group-hover:text-white">GitHub</span>
                </a>
            </div>
          </div>

          {/* Checkbox Jangan Tampilkan Lagi */}
          <label className="flex items-center gap-2 mb-4 cursor-pointer group w-full justify-center">
            <div className="relative flex items-center justify-center">
              <input 
                type="checkbox" 
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="peer appearance-none w-4 h-4 border border-[#4A4A4E] rounded bg-[#141414] checked:bg-indigo-500 checked:border-indigo-500 cursor-pointer transition-all"
              />
              <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-xs text-[#8C8C8C] group-hover:text-white transition-colors">
              Jangan tampilkan pesan ini lagi
            </span>
          </label>

          {/* Tombol Aksi */}
          <button 
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors active:scale-95 duration-200"
          >
            Tutup
          </button>
          
        </div>
      </div>
    </div>
  );
}