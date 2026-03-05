"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AnimeRecommendations({ recommendations }: { recommendations?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!recommendations || recommendations.length === 0) return null;

  const currentYear = new Date().getFullYear();
  const totalRecs = recommendations.length;
  const maxItems = 6;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalRecs) % totalRecs);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalRecs);
  };

  const visibleAnimes = [];
  const renderCount = Math.min(maxItems, totalRecs);
  for (let i = 0; i < renderCount; i++) {
    visibleAnimes.push(recommendations[(currentIndex + i) % totalRecs]);
  }

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
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] active:bg-[#1A1A1C] border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={handleNext}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] active:bg-[#1A1A1C] border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm active:scale-95"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {visibleAnimes.map((anime, idx) => {
          const type = anime.type || 'TV';
          const releaseYear = anime.release_year || currentYear;
          const eps = anime.episode_count || anime.current_episode?.replace(/\D/g, "") || '?';

          let displayClass = "flex";
          if (idx === 3) displayClass = "hidden md:flex"; 
          if (idx === 4) displayClass = "hidden lg:flex"; 
          if (idx === 5) displayClass = "hidden xl:flex"; 

          return (
            <Link 
              href={`/anime/${anime.slug.replace('https://otakudesu.best/anime/', '')}`} 
              key={`${anime.slug}-${idx}`}
              // PERUBAHAN: Tambahkan 'active:scale-[0.98]' pada container link
              className={`group flex-col active:scale-[0.98] transition-transform duration-200 ${displayClass}`}
            >
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1C] mb-2 sm:mb-2.5 relative group-hover:ring-2 group-active:ring-2 ring-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1.5">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" loading="lazy" />
                 
                 {/* Overlay Play Icon: Hover & Active */}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-colors duration-300 z-20 flex items-center justify-center">
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 hover:scale-120 transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.89 10.363l-10.29-6.39c-1.258-.781-2.9.117-2.9 1.637v12.78c0 1.52 1.642 2.418 2.9 1.637l10.29-6.39c1.218-.756 1.218-2.518 0-3.274z"/>
                    </svg>
                 </div>
              </div>
              
              <h3 className="text-[12px] sm:text-[13px] md:text-[14px] font-bold text-slate-200 group-hover:text-indigo-400 group-active:text-indigo-400 line-clamp-2 leading-snug mb-1 transition-colors">
                {anime.title}
              </h3>

              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wide">
                <span>{type}</span>
                <span className="flex items-center gap-1 hidden sm:flex">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {releaseYear}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  {eps !== '?' ? eps : '???'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}