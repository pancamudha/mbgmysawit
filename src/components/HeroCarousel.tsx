"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

interface AnimeItem {
  id: string;
  title: string;
  japanese_title?: string; // Ditambahkan untuk mendukung multi-bahasa
  poster: string;
  description?: string; 
  status?: string;
  tvInfo?: {
    showType?: string;
    duration?: string;
    releaseDate?: string;
    quality?: string;
    sub?: string | number;
    dub?: string | number;
    eps?: string | number;
    episodeInfo?: { sub?: string | number; dub?: string | number; eps?: string | number };
  };
}

const getDynamicGradient = (title: string) => {
  const gradients = [
    "from-indigo-300 via-white to-white",
    "from-rose-300 via-white to-white",
    "from-emerald-300 via-white to-white",
    "from-amber-300 via-white to-white",
    "from-cyan-300 via-white to-white",
    "from-fuchsia-300 via-white to-white",
    "from-orange-300 via-white to-white",
    "from-violet-300 via-white to-white",
    "from-blue-300 via-white to-white"
  ];
  let hash = 0;
  if (title) {
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getSeasonString = (dateStr?: string) => {
  if (!dateStr || dateStr === '?') return '';
  const parts = dateStr.replace(/,/g, '').split(' ');
  if (parts.length < 3) return dateStr; 
  
  const month = parts[0].toLowerCase();
  const year = parts[parts.length - 1];
  let season = '';
  if (['dec', 'jan', 'feb'].includes(month)) season = 'Winter';
  else if (['mar', 'apr', 'may'].includes(month)) season = 'Spring';
  else if (['jun', 'jul', 'aug'].includes(month)) season = 'Summer';
  else if (['sep', 'oct', 'nov'].includes(month)) season = 'Fall';
  else return dateStr; 
  return `${season} ${year}`;
};

export default function HeroCarousel({ animes = [] }: { animes: AnimeItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselAnimes = animes.slice(0, 10);
  const { getTitle } = useAnimeTitle(); // Memanggil hook bahasa

  useEffect(() => {
    if (carouselAnimes.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselAnimes.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselAnimes.length]);

  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? carouselAnimes.length - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev === carouselAnimes.length - 1 ? 0 : prev + 1));

  if (carouselAnimes.length === 0) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-0">
      <div className="relative w-full h-[400px] sm:h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-[#0A0A0B] shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        {carouselAnimes.map((anime, index) => {
          const isActive = index === currentIndex;
          
          const subCount = anime.tvInfo?.episodeInfo?.sub || anime.tvInfo?.sub;
          const dubCount = anime.tvInfo?.episodeInfo?.dub || anime.tvInfo?.dub;
          const episodeCount = anime.tvInfo?.episodeInfo?.eps || anime.tvInfo?.eps || subCount;
          const quality = anime.tvInfo?.quality || 'HD';
          
          // Dapatkan judul sesuai bahasa (tetap gunakan title inggris untuk kalkulasi warna agar tidak ganti warna saat ganti bahasa)
          const displayTitle = getTitle(anime.title, anime.japanese_title);
          const titleGradient = getDynamicGradient(anime.title || "Unknown");
          const seasonText = getSeasonString(anime.tvInfo?.releaseDate);
          
          // Logika slug episode pertama (sama dengan AnimeHero)
          const firstEpisodeSlug = anime.id || '#';

          return (
            <div key={anime.id} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={anime.poster} alt={displayTitle} className="w-full h-full object-cover object-[center_20%] opacity-90" />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent h-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent w-[85%] md:w-[65%]" />

              <div className="absolute top-0 left-0 w-full p-4 sm:p-5 md:p-6 z-30 flex items-center justify-between">
                <div className="flex items-stretch gap-1 drop-shadow-lg h-[24px] sm:h-[28px]">
                  {quality && (
                    <div className="flex items-center justify-center px-2 bg-black/30 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] sm:text-[11px] rounded-md uppercase tracking-wider shadow-sm">
                      {quality}
                    </div>
                  )}
                  {!!subCount && Number(subCount) > 0 && (
                    <div className="flex items-center justify-center gap-1.5 px-2 bg-black/30 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] sm:text-[11px] rounded-md shadow-sm">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 5.5C2 4.67157 2.67157 4 3.5 4H16.5C17.3284 4 18 4.67157 18 5.5V14.5C18 15.3284 17.3284 16 16.5 16H3.5C2.67157 16 2 15.3284 2 14.5V5.5ZM4.5 10.5C4.5 11.8807 5.61929 13 7 13C8.38071 13 9.5 11.8807 9.5 10.5V9.5H8V10.5C8 11.0523 7.55228 11.5 7 11.5C6.44772 11.5 6 11.0523 6 10.5V9.5C6 8.94772 6.44772 8.5 7 8.5C7.55228 8.5 8 8.94772 8 9.5H9.5C9.5 8.11929 8.38071 7 7 7C5.61929 7 4.5 8.11929 4.5 9.5V10.5ZM10.5 10.5C10.5 11.8807 11.6193 13 13 13C14.3807 13 15.5 11.8807 15.5 10.5V9.5H14V10.5C14 11.0523 13.5523 11.5 13 11.5C12.4477 11.5 12 11.0523 12 10.5V9.5C12 8.94772 12.4477 8.5 13 8.5C13.5523 8.5 14 8.94772 14 9.5H15.5C15.5 8.11929 14.3807 7 13 7C11.6193 7 10.5 8.11929 10.5 9.5V10.5Z"/>
                      </svg>
                      {subCount}
                    </div>
                  )}
                  {!!dubCount && Number(dubCount) > 0 && (
                    <div className="flex items-center justify-center gap-1.5 px-2 bg-black/30 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] sm:text-[11px] rounded-md shadow-sm">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 3a3 3 0 013 3v5a3 3 0 01-6 0V6a3 3 0 013-3z" />
                        <path d="M5 10a5 5 0 0010 0v-1h-2v1a3 3 0 01-6 0v-1H5v1z" />
                        <path d="M8 16h2v3H8v-3z" />
                      </svg>
                      {dubCount}
                    </div>
                  )}
                  {(!subCount && !dubCount) && !!episodeCount && (
                    <div className="flex items-center justify-center px-2 bg-black/30 backdrop-blur-md border border-white/10 text-white font-bold text-[10px] sm:text-[11px] rounded-md uppercase tracking-wide shadow-sm">
                      EP {episodeCount}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button onClick={handlePrev} className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/30 hover:bg-white/10 backdrop-blur-md border border-white/10 items-center justify-center text-white transition-colors shadow-sm" aria-label="Previous Slide">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <div className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-sm min-w-[56px] sm:min-w-[64px]">
                    <span className="text-[13px] sm:text-[15px] font-black -translate-y-[1px]">{currentIndex + 1}</span>
                    <span className="text-white/30 mx-1.5 text-[11px] sm:text-[12px] font-bold rotate-12">/</span>
                    <span className="text-[10px] sm:text-[11px] text-white/80 font-bold translate-y-[2px]">{carouselAnimes.length}</span>
                  </div>
                  <button onClick={handleNext} className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/30 hover:bg-white/10 backdrop-blur-md border border-white/10 items-center justify-center text-white transition-colors shadow-sm" aria-label="Next Slide">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 z-20">
                <div className="flex-1 max-w-[650px] flex flex-col items-center text-center sm:items-start sm:text-left mx-auto sm:mx-0">
                  <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 sm:gap-2.5 text-[10px] sm:text-xs md:text-[13px] font-semibold text-slate-300 mb-1.5 sm:mb-2 tracking-wide">
                    <span className="text-white">{anime.tvInfo?.showType?.toUpperCase() || 'TV'}</span>
                    {seasonText && (
                      <>
                        <span className="text-slate-600 text-[10px] sm:text-[11px]">•</span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {seasonText}
                        </span>
                      </>
                    )}
                    <span className="text-slate-600 text-[10px] sm:text-[11px]">•</span>
                    <span className={anime.status?.toLowerCase() === 'completed' ? "text-indigo-400" : "text-emerald-400"}>
                      {anime.status ? anime.status.toUpperCase() : 'RELEASING'}
                    </span>
                    {!!episodeCount && (
                      <>
                        <span className="text-slate-600 text-[10px] sm:text-[11px]">•</span>
                        <span>{episodeCount} Episodes</span>
                      </>
                    )}
                    {anime.tvInfo?.duration && (
                      <>
                        <span className="text-slate-600 text-[10px] sm:text-[11px]">•</span>
                        <span>{anime.tvInfo.duration.toLowerCase()}</span>
                      </>
                    )}
                  </div>
                  <h1 className={`text-2xl sm:text-3xl md:text-[36px] font-extrabold leading-[1.1] mb-1.5 sm:mb-2 drop-shadow-md line-clamp-2 tracking-tight bg-gradient-to-r ${titleGradient} text-transparent bg-clip-text`}>
                    {displayTitle}
                  </h1>
                  <p className="text-[11px] sm:text-xs md:text-[13px] leading-relaxed text-slate-400 line-clamp-3 sm:line-clamp-2 max-w-[550px] mb-3 sm:mb-0">
                    {anime.description || `Saksikan kisah perjalanan seru dan aksi mendebarkan di dunia penuh intrik. Jangan lewatkan kelanjutan cerita karakter favorit Anda dalam episode terbaru ini.`}
                  </p>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
                  <Link href={`/watch/${firstEpisodeSlug}`} className="bg-white hover:bg-slate-200 text-black font-bold py-2.5 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-sm flex-1 sm:flex-none shadow-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Watch Now
                  </Link>
                  <Link href={`/anime/${anime.id}`} className="bg-black/30 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-medium py-2.5 sm:py-2.5 px-4 sm:px-5 rounded-lg transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-sm flex-1 sm:flex-none shadow-lg">
                    <svg className="w-4 h-4 sm:w-4 sm:h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}