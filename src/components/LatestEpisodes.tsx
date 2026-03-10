"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

interface AnimeItem {
  id: string;
  title: string;
  japanese_title?: string;
  poster: string;
  status?: string;
  tvInfo?: {
    showType?: string;
    sub?: string | number;
    dub?: string | number;
    eps?: string | number;
    releaseDate?: string;
  };
}

export default function LatestEpisodes({ animes = [] }: { animes: AnimeItem[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { getTitle } = useAnimeTitle(); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setItemsPerPage(10);
      } else {
        setItemsPerPage(12);
      }
    };
    
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const totalPages = Math.max(1, Math.ceil(animes.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);

  const handlePrev = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));

  const displayedAnimes = animes.slice(safePage * itemsPerPage, (safePage + 1) * itemsPerPage);
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full">
      <div className="mb-4 sm:mb-5 flex items-end justify-between gap-4">
        <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-white flex items-center gap-2.5">
          <svg className="w-[22px] h-[22px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Latest Episodes
        </h2>
        
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} disabled={safePage === 0} className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} disabled={safePage >= totalPages - 1} className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 mb-10">
        {displayedAnimes.map((anime, index) => {
          const sub = anime.tvInfo?.sub;
          const eps = anime.tvInfo?.eps;
          
          const currentEps = sub || eps || '';
          const showType = anime.tvInfo?.showType || 'TV';
          const releaseYear = anime.tvInfo?.releaseDate ? anime.tvInfo.releaseDate.split(', ').pop() : currentYear;
          const epsCount = eps || sub || '';

          const isCompleted = 
            anime.status?.toLowerCase() === 'completed' || 
            anime.status?.toLowerCase() === 'complete' ||
            (!!sub && !!eps && String(sub) === String(eps)) ||
            anime.id?.toLowerCase().includes('-complete') ||
            anime.id?.toLowerCase().includes('-batch');

          const dotBg = isCompleted ? 'bg-blue-500' : 'bg-green-500';
          const dotShadow = isCompleted ? '' : 'shadow-[0_0_8px_rgba(34,197,94,0.8)]';
          const dotPulse = isCompleted ? '' : 'animate-pulse';
          
          const displayTitle = getTitle(anime.title, anime.japanese_title);

          return (
            <Link href={`/anime/${anime.id}`} key={`${anime.id}-${index}`} className="group cursor-pointer flex flex-col active:scale-[0.98] transition-transform duration-200">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1C] mb-2.5 group-hover:ring-2 group-active:ring-2 ring-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1.5">
                <img src={anime.poster} alt={displayTitle} className="w-full h-full object-cover" loading="lazy" />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-colors duration-300 z-20 flex items-center justify-center">
                  <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 hover:scale-120 transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.89 10.363l-10.29-6.39c-1.258-.781-2.9.117-2.9 1.637v12.78c0 1.52 1.642 2.418 2.9 1.637l10.29-6.39c1.218-.756 1.218-2.518 0-3.274z"/>
                  </svg>
                </div>
                
                {currentEps && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md z-30">
                    EP {currentEps}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent opacity-80 z-10" />
              </div>
              
              <div className="flex items-start gap-1.5">
                <span className={`w-2 h-2 rounded-full ${dotBg} mt-1.5 shrink-0 ${dotShadow} ${dotPulse}`} />
                <h3 className="text-[13px] sm:text-[14px] font-bold line-clamp-1 group-hover:text-indigo-400 group-active:text-indigo-400 transition-colors text-white leading-snug">
                  {displayTitle}
                </h3>
              </div>
              
              {/* PERUBAHAN DI SINI: Otomatis tumpuk vertikal jika sidebar expanded */}
              <div className="flex flex-col sm:flex-row [.sidebar-expanded_&]:flex-col items-start sm:items-center [.sidebar-expanded_&]:items-start gap-0.5 sm:gap-2 [.sidebar-expanded_&]:gap-0.5 mt-1 text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <span>{showType}</span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {releaseYear}
                  </span>
                </div>
                {epsCount && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    {epsCount} EPS
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}