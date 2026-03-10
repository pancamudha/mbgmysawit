"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

interface AnimeRelatedProps {
  relations?: any[];
  seasons?: any[];
  hasTrailer?: boolean;
  trailerNode?: React.ReactNode; 
}

export default function AnimeRelated({ relations = [], seasons = [], hasTrailer = false, trailerNode }: AnimeRelatedProps) {
  const [isViewAll, setIsViewAll] = useState(false);
  const { getTitle } = useAnimeTitle(); // Memanggil Hook Bahasa
  
  const mappedSeasons = seasons.map((s: any) => ({
    id: s.id,
    title: s.title,
    japanese_title: s.japanese_title,
    poster: s.season_poster || s.poster,
    typeLabel: s.season || 'SEASON'
  }));

  const mappedRelations = relations.map((r: any) => ({
    id: r.id,
    title: r.title,
    japanese_title: r.japanese_title,
    poster: r.poster,
    typeLabel: r.tvInfo?.showType || 'RELATED'
  }));

  const combinedItems = [...mappedSeasons, ...mappedRelations];
  const uniqueItems = Array.from(new Map(combinedItems.map(item => [item.id, item])).values());

  if (uniqueItems.length === 0) return null;

  // LOGIKA LIMIT: 
  // Jika ada trailer (Sidebar mode): Selalu tampilkan 4
  // Jika tidak ada trailer (Full mode): Tampilkan 8 di desktop (4x2), dan tetap 4 di mobile. 
  
  const isExpandable = uniqueItems.length > 4; // Tombol selalu muncul jika item lebih dari 4

  const sidebarItems = hasTrailer ? uniqueItems.slice(0, 4) : [];
  const expandedItems = hasTrailer ? uniqueItems.slice(4) : [];
  
  // Untuk fullWidthItems, jika View All di-klik, tampilkan semua.
  const fullWidthItems = !hasTrailer ? uniqueItems : [];

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8">
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        <div className={`w-full order-2 lg:order-1 ${hasTrailer ? 'lg:col-span-3' : 'lg:col-span-12'}`}>
          
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white tracking-tight">
               Related Anime
            </h2>

            {/* Tombol View All - Hanya muncul jika ada lebih dari batas yang ditentukan */}
            {isExpandable && (
              <button 
                onClick={() => setIsViewAll(!isViewAll)}
                className={`text-[12px] sm:text-[13px] font-semibold text-[#8C8C8C] hover:text-white transition-colors flex items-center gap-1 ${!hasTrailer && uniqueItems.length <= 8 ? 'lg:hidden' : ''}`}
              >
                {isViewAll ? 'Show Less' : 'View All'}
                <svg 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${isViewAll ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          <div className={`grid gap-3 sm:gap-4 ${
            hasTrailer 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1' 
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          }`}>
            {(hasTrailer ? sidebarItems : fullWidthItems).map((anime, idx) => {
              
              let displayClass = "block";
              
              if (!isViewAll) {
                 if (hasTrailer) {
                    if (idx >= 8) displayClass = "hidden";
                    else if (idx >= 4) displayClass = "hidden sm:block lg:hidden"; 
                 } else {
                    if (idx >= 8) displayClass = "hidden";
                    else if (idx >= 4) displayClass = "hidden sm:block"; 
                 }
              }

              const displayTitle = getTitle(anime.title, anime.japanese_title);

              return (
                <Link 
                  href={`/anime/${anime.id}`}
                  key={idx}
                  className={`relative w-full h-[120px] sm:h-[130px] rounded-xl overflow-hidden group border border-white/10 hover:border-white/30 active:border-white/30 active:scale-[0.98] transition-all duration-200 shrink-0 shadow-lg ${displayClass}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={anime.poster} alt={displayTitle} className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 group-active:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] group-hover:bg-black/50 group-hover:backdrop-blur-none group-active:bg-black/50 group-active:backdrop-blur-none transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 drop-shadow-md text-slate-200 line-clamp-1">
                      {anime.typeLabel}
                    </span>
                    <span className="text-[13px] sm:text-[14px] font-bold text-white line-clamp-2 drop-shadow-md group-hover:text-white group-active:text-white transition-colors leading-tight">
                      {displayTitle}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {hasTrailer && trailerNode && (
          <div className="w-full order-1 lg:order-2 lg:col-span-9">
            {trailerNode}
          </div>
        )}

      </div>

      {hasTrailer && isViewAll && expandedItems.length > 0 && (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {expandedItems.map((anime, idx) => {
             const displayTitle = getTitle(anime.title, anime.japanese_title);
             return (
              <Link 
                href={`/anime/${anime.id}`}
                key={`expanded-${idx}`}
                className="relative w-full h-[120px] sm:h-[130px] rounded-xl overflow-hidden group border border-white/10 hover:border-white/30 active:border-white/30 active:scale-[0.98] transition-all duration-200 shrink-0 shadow-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={anime.poster} alt={displayTitle} className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 group-active:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] group-hover:bg-black/50 group-hover:backdrop-blur-none group-active:bg-black/50 group-active:backdrop-blur-none transition-all duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 drop-shadow-md text-slate-200 line-clamp-1">
                    {anime.typeLabel}
                  </span>
                  <span className="text-[13px] sm:text-[14px] font-bold text-white line-clamp-2 drop-shadow-md group-hover:text-white group-active:text-white transition-colors leading-tight">
                    {displayTitle}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

    </div>
  );
}