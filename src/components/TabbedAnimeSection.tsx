"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnimeItem {
  id: string;
  title: string;
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

interface TabbedProps {
  topAiring?: AnimeItem[];
  mostPopular?: AnimeItem[];
  mostFavorite?: AnimeItem[];
}

export default function TabbedAnimeSection({ topAiring = [], mostPopular = [], mostFavorite = [] }: TabbedProps) {
  const tabs = [
    { id: "Top Airing", mobile: "Airing", desktop: "Top Airing" },
    { id: "Most Popular", mobile: "Popular", desktop: "Most Popular" },
    { id: "Favourites", mobile: "Favourites", desktop: "Favourites" }
  ];
  
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  let currentAnimes: AnimeItem[] = [];
  if (activeTab === "Top Airing") currentAnimes = topAiring;
  else if (activeTab === "Most Popular") currentAnimes = mostPopular;
  else if (activeTab === "Favourites") currentAnimes = mostFavorite;

  const totalPages = Math.max(1, Math.ceil(currentAnimes.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages - 1);
  const currentYear = new Date().getFullYear();

  const handlePrev = () => setCurrentPage((prev) => (prev > 0 ? prev - 1 : 0));
  const handleNext = () => setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const displayedAnimes = currentAnimes.slice(safePage * itemsPerPage, (safePage + 1) * itemsPerPage);

  return (
    <div className="w-full mt-10 sm:mt-12">
      <div className="flex items-end justify-between mb-5 gap-4 border-b border-[#2A2A2E]/50 pb-2">
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative pb-2 text-[15px] sm:text-[16px] font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-white' : 'text-[#8C8C8C] hover:text-slate-300'
              }`}
            >
              <span className="sm:hidden">{tab.mobile}</span>
              <span className="hidden sm:inline">{tab.desktop}</span>
              {activeTab === tab.id && (
                <span className="absolute bottom-[-2px] left-0 w-full h-[3px] bg-white rounded-t-sm" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 pb-1">
          <button onClick={handlePrev} disabled={safePage === 0} className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={handleNext} disabled={safePage >= totalPages - 1} className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-[#0A0A0B] hover:bg-[#141414] disabled:opacity-40 disabled:cursor-not-allowed border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-sm">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {displayedAnimes.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
          {displayedAnimes.map((anime: AnimeItem, index: number) => {
            const sub = anime.tvInfo?.sub;
            const eps = anime.tvInfo?.eps;

            const isCompleted = 
              anime.status?.toLowerCase() === 'completed' || 
              anime.status?.toLowerCase() === 'complete' ||
              (!!sub && !!eps && String(sub) === String(eps)) ||
              anime.id?.toLowerCase().includes('-complete') ||
              anime.id?.toLowerCase().includes('-batch');

            const dotBg = isCompleted ? 'bg-blue-500' : 'bg-green-500';
            const dotShadow = isCompleted ? '' : 'shadow-[0_0_8px_rgba(34,197,94,0.8)]';
            const dotPulse = isCompleted ? '' : 'animate-pulse';
            
            const releaseYear = anime.tvInfo?.releaseDate ? anime.tvInfo.releaseDate.split(', ').pop() : currentYear;
            const epsCount = eps || sub || '';
            const showType = anime.tvInfo?.showType || 'TV';

            return (
              <Link href={`/anime/${anime.id}`} key={`${anime.id}-${index}`} className="group cursor-pointer flex flex-col active:scale-[0.98] transition-transform duration-200">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1C] group-hover:ring-2 group-active:ring-2 ring-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1.5">
                  <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" loading="lazy" />
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-colors duration-300 z-20 flex items-center justify-center">
                    <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 hover:scale-120 transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.89 10.363l-10.29-6.39c-1.258-.781-2.9.117-2.9 1.637v12.78c0 1.52 1.642 2.418 2.9 1.637l10.29-6.39c1.218-.756 1.218-2.518 0-3.274z"/>
                    </svg>
                  </div>
                </div>
                
                <div className="pt-2.5 sm:pt-3 flex flex-col gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotBg} mt-1.5 shrink-0 ${dotShadow} ${dotPulse}`} />
                    <h3 className="text-[14px] sm:text-[15px] font-bold line-clamp-1 text-white group-hover:text-indigo-400 group-active:text-indigo-400 transition-colors leading-snug">
                      {anime.title}
                    </h3>
                  </div>

                  {/* PERUBAHAN DI SINI: flex-col di mobile, flex-row di desktop */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wide">
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
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="w-full py-10 flex justify-center text-slate-500 font-medium">Memuat data...</div>
      )}
    </div>
  );
}