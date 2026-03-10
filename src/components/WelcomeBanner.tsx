"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WelcomeBanner() {
  const [isWelcomeMode, setIsWelcomeMode] = useState(true);
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [loopCount, setLoopCount] = useState(0);

  const loopingSubtitles = [
    "Share it With your Friends!",
    "Add it to your Bookmarks!",
    "Join our Discord Community",
    "Follow us on Instagram",
    "Comments are Back!"
  ];

  // Mengatur siklus interval & timeout
  useEffect(() => {
    let timer: any;

    if (isWelcomeMode) {
      // Fase 1: Tampilkan Welcome selama 10 detik, lalu pindah mode
      timer = setTimeout(() => {
        setIsWelcomeMode(false);
        setSubtitleIndex(0);
        setLoopCount(0);
      }, 10000);
    } else {
      // Fase 2: Ganti subtitle setiap 4 detik
      timer = setInterval(() => {
        setSubtitleIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          
          // Jika indeks sudah mencapai batas akhir, hitung sebagai 1 putaran (loop)
          if (nextIndex === loopingSubtitles.length) {
            setLoopCount((prevCount) => prevCount + 1);
            return 0; // kembali ke subtitle pertama
          }
          return nextIndex;
        });
      }, 3000);
    }

    // Bersihkan timer saat komponen di-unmount atau mode berubah
    return () => {
      if (isWelcomeMode) clearTimeout(timer);
      else clearInterval(timer);
    };
  }, [isWelcomeMode, loopingSubtitles.length]);

  // Memantau putaran: jika sudah 2x putaran penuh, kembali ke mode Welcome
  useEffect(() => {
    if (!isWelcomeMode && loopCount >= 3) {
      setIsWelcomeMode(true);
    }
  }, [loopCount, isWelcomeMode]);

  const currentTitle = isWelcomeMode ? "Welcome to Animaple!" : "Love the Site?";
  const currentSubtitle = isWelcomeMode ? "Enjoy watching your favorite anime." : loopingSubtitles[subtitleIndex];

  return (
    <>
      {/* CSS Keyframes bawaan untuk efek animasi spesifik tanpa merusak tailwind.config.js */}
      <style>{`
        @keyframes fadeInOnly {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-in {
          animation: fadeInOnly 0.7s ease-out forwards;
        }
        .anim-slide-up-fade {
          animation: slideUpFade 0.7s ease-out forwards;
        }
      `}</style>

      {/* PADDING tetap p-2.5 sm:p-3 agar jarak atas, bawah, kiri, dan kanan SAMA RATA */}
      <div className="w-full bg-[#121212] border border-[#282828] rounded-lg p-2.5 sm:p-3 mb-5 flex items-center justify-between shadow-sm transition-colors duration-300">
        
        {/* Kiri: Avatar & Teks */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 rounded-md overflow-hidden shrink-0 border border-[#282828]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/welcome.webp" 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col justify-center overflow-hidden py-0.5">
            {/* Judul dengan animasi Fade biasa (0.6s) */}
            <h3 key={currentTitle} className="text-white font-bold text-[13px] sm:text-[14px] leading-tight mb-0.5 anim-fade-in">
              {currentTitle}
            </h3>
            {/* Subtitle dengan animasi Slide Up + Fade (0.6s) */}
            <p key={currentSubtitle} className="text-[#8C8C8C] text-[10px] sm:text-[11px] font-medium leading-tight anim-slide-up-fade">
              {currentSubtitle}
            </p>
          </div>
        </div>

        {/* Kanan: Social Icons */}
        <div className="flex items-center gap-4 sm:gap-5 pr-1">
          
          {/* Discord */}
          <Link href="#" className="text-white hover:text-[#5865F2] transition-colors" aria-label="Discord">
            <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
          </Link>
          
          {/* Telegram */}
          <Link href="#" className="text-white hover:text-[#0088cc] transition-colors" aria-label="Telegram">
            <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          </Link>
          
          {/* Instagram */}
          <Link href="#" className="text-white hover:text-[#E1306C] transition-colors" aria-label="Instagram">
            <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </Link>
          
        </div>

      </div>
    </>
  );
}