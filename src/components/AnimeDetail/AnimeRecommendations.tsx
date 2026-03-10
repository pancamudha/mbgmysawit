"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

export default function AnimeRecommendations({ recommendations }: { recommendations?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6); // Default jumlah item yang tampil
  const { getTitle } = useAnimeTitle(); // Memanggil Hook Bahasa

  // Deteksi ukuran layar untuk menentukan kapan slider harus "mentok"
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setVisibleCount(6); // xl: mentok 6
      } else if (window.innerWidth >= 1024) {
        setVisibleCount(5); // lg: mentok 5
      } else if (window.innerWidth >= 768) {
        setVisibleCount(4); // md: mentok 4
      } else {
        setVisibleCount(3); // mobile/sm: mentok 3
      }
    };

    handleResize(); // Set nilai awal saat komponen dimuat
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Jaga-jaga: kalau Ofik ubah ukuran layar dari kecil ke besar,
  // posisinya akan menyesuaikan biar nggak out-of-bounds!
  useEffect(() => {
    if (recommendations && currentIndex > Math.max(0, recommendations.length - visibleCount)) {
      setCurrentIndex(Math.max(0, recommendations.length - visibleCount));
    }
  }, [visibleCount, recommendations, currentIndex]);

  if (!recommendations || recommendations.length === 0) return null;

  const currentYear = new Date().getFullYear();
  const totalRecs = recommendations.length;
  
  // Tetap ambil 6 item maksimal per render agar styling grid Ofik tetap aman
  const maxVisible = 6; 

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    // Berhenti tepat ketika jumlah item yang tersisa sama dengan yang bisa ditampilkan
    setCurrentIndex((prev) => Math.min(totalRecs - visibleCount, prev + 1));
  };

  const isAtStart = currentIndex === 0;
  // Tombol Next akan disabled kalau posisi sudah mentok sesuai ukuran layar
  const isAtEnd = currentIndex >= totalRecs - visibleCount || totalRecs <= visibleCount;

  // Mengambil item yang akan ditampilkan (sliding window)
  const visibleAnimes = recommendations.slice(currentIndex, currentIndex + maxVisible);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white tracking-tight">
            Recommended for You
        </h2>
        
        {totalRecs > 1 && (
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              disabled={isAtStart}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] active:bg-[#1A1A1C] border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2A2A2E] disabled:active:scale-100"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={handleNext}
              disabled={isAtEnd}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] active:bg-[#1A1A1C] border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2A2A2E] disabled:active:scale-100"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {visibleAnimes.map((anime, idx) => {
          const type = anime.tvInfo?.showType || 'TV';
          const releaseYear = currentYear;
          const eps = anime.tvInfo?.eps || anime.tvInfo?.sub || '?';

          // Responsif: Sembunyikan item terakhir di layar yang lebih kecil agar grid tetap rapi
          let displayClass = "flex";
          if (idx === 3) displayClass = "hidden md:flex"; 
          if (idx === 4) displayClass = "hidden lg:flex"; 
          if (idx === 5) displayClass = "hidden xl:flex"; 

          const displayTitle = getTitle(anime.title, anime.japanese_title);

          return (
            <Link 
              href={`/anime/${anime.id}`} 
              key={`${anime.id}-${currentIndex + idx}`}
              className={`group flex-col active:scale-[0.98] transition-transform duration-200 ${displayClass}`}
            >
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1C] mb-2 sm:mb-2.5 relative group-hover:ring-2 group-active:ring-2 ring-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1.5">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={anime.poster} alt={displayTitle} className="w-full h-full object-cover" loading="lazy" />
                 
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-colors duration-300 z-20 flex items-center justify-center">
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 hover:scale-120 transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.89 10.363l-10.29-6.39c-1.258-.781-2.9.117-2.9 1.637v12.78c0 1.52 1.642 2.418 2.9 1.637l10.29-6.39c1.218-.756 1.218-2.518 0-3.274z"/>
                    </svg>
                 </div>
              </div>
              
              <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-bold text-slate-200 group-hover:text-indigo-400 group-active:text-indigo-400 truncate leading-snug mb-1 transition-colors">
                {displayTitle}
              </h3>

              {/* PERUBAHAN DI SINI: Ditambahkan teks 'EPS' dan layout flex-wrap yang aman */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wide">
                <span className="shrink-0">{type}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {releaseYear}
                </span>
                <span className="flex items-center gap-1 shrink-0">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  {eps !== '?' ? `${eps} EPS` : '??? EPS'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}