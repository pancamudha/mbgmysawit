"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

interface AnimeItem {
  id: string;
  title: string;
  japanese_title?: string;
  poster: string;
  tvInfo?: {
    showType?: string;
    duration?: string; 
    releaseDate?: string;
  };
}

export default function TopUpcoming({ animes = [] }: { animes: AnimeItem[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getTitle } = useAnimeTitle();
  const initialCount = 6;
  
  if (animes.length === 0) return null;

  const displayedList = isExpanded ? animes : animes.slice(0, initialCount);

  return (
    <div className="w-full">
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
        <svg className="w-[20px] h-[20px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-white">
          Top Upcoming
        </h2>
      </div>

      <div className={`flex flex-col gap-2.5 transition-all duration-300 ${
        isExpanded ? 'max-h-[620px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' : ''
      }`}>
        {displayedList.map((anime, index) => {
          // LOGIKA PEMBERSIH TEKS: Karena API menaruh tanggal rilis di dalam duration atau releaseDate
          const rawDate = anime.tvInfo?.duration || anime.tvInfo?.releaseDate || '';
          const releaseYear = rawDate !== '?' && rawDate.includes(', ') 
            ? rawDate.split(', ').pop() 
            : (rawDate !== '?' ? rawDate : 'TBA');

          let showType = 'TV';
          let epsCount = '?';

          // Memecah "Movie (1 eps)" atau "ONA (? eps)"
          if (anime.tvInfo?.showType) {
            const parts = anime.tvInfo.showType.split(' (');
            showType = parts[0];
            if (parts[1]) {
              epsCount = parts[1].replace('eps)', '').trim();
            }
          }
          
          const displayTitle = getTitle(anime.title, anime.japanese_title);

          return (
            <Link href={`/anime/${anime.id}`} key={`upcoming-${anime.id}-${index}`} className="group relative flex items-center gap-3.5 p-2 rounded-xl overflow-hidden bg-[#141414] border border-white/5 hover:border-white/10 active:border-white/10 transition-all duration-300 shrink-0">
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={anime.poster} alt="" className="w-full h-full object-cover scale-105 grayscale opacity-[0.25] group-hover:grayscale-0 group-hover:translate-x-[6px] group-hover:opacity-[0.6] group-active:grayscale-0 group-active:translate-x-[6px] group-active:opacity-[0.6] transition-all duration-500 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
              </div>

              <div className="w-[48px] sm:w-[54px] aspect-[4/5] rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={anime.poster} alt={displayTitle} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex flex-col flex-1 py-1 z-10 pr-2 transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
                <h3 className="text-white font-bold text-[13px] sm:text-[14px] leading-snug line-clamp-2 mb-1 group-hover:text-white/80 group-active:text-white/80 transition-colors drop-shadow-md">
                  {displayTitle}
                </h3>
                <div className="flex items-center flex-wrap gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#8C8C8C] tracking-wider uppercase drop-shadow-md">
                  <span>{releaseYear}</span>
                  <span className="text-[#4A4A4E]">•</span>
                  <span className="text-white/80">{showType}</span>
                  <span className="text-[#4A4A4E]">•</span>
                  <span>{epsCount} EPS</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {animes.length > initialCount && (
        <div className="mt-2 flex justify-center">
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-[11px] sm:text-xs font-semibold text-[#8C8C8C] hover:text-white flex items-center gap-1.5 transition-colors py-2 px-4">
            {isExpanded ? 'Show Less' : 'Show More'}
            <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}