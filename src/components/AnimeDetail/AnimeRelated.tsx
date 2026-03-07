"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface AnimeRelatedProps {
  relations?: any[];
  seasons?: any[];
  hasTrailer?: boolean;
}

export default function AnimeRelated({ relations = [], seasons = [], hasTrailer = false }: AnimeRelatedProps) {
  const [isViewAll, setIsViewAll] = useState(false);
  
  const mappedSeasons = seasons.map((s: any) => ({
    id: s.id,
    title: s.title,
    poster: s.season_poster || s.poster,
    typeLabel: s.season || 'SEASON'
  }));

  const mappedRelations = relations.map((r: any) => ({
    id: r.id,
    title: r.title,
    poster: r.poster,
    typeLabel: r.tvInfo?.showType || 'RELATED'
  }));

  const combinedItems = [...mappedSeasons, ...mappedRelations];
  const uniqueItems = Array.from(new Map(combinedItems.map(item => [item.id, item])).values());

  if (uniqueItems.length === 0) return null;

  // Batas awal dinamis: Jika vertikal (ada trailer) tampilkan 4. Jika full layar (tanpa trailer) tampilkan 12 (Grid 4x3)
  const initialLimit = hasTrailer ? 4 : 12;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white tracking-tight">
           Related Anime
        </h2>

        {/* Munculkan tombol View All jika item melebihi limit tampilan awal */}
        {uniqueItems.length > initialLimit && (
          <button 
            onClick={() => setIsViewAll(!isViewAll)}
            className="text-[12px] sm:text-[13px] font-semibold text-[#8C8C8C] hover:text-white transition-colors flex items-center gap-1"
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

      {/* RENDER GRID DINAMIS:
          - Jika hasTrailer: 1 Kolom (Menurun)
          - Jika !hasTrailer: 4 Kolom (Menyamping)
      */}
      <div className={`grid gap-3 sm:gap-4 ${
        hasTrailer 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1' 
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      }`}>
        {uniqueItems.map((anime, idx) => {
          let displayClass = "block"; 
          
          // Logika Hidden Dinamis
          if (!isViewAll) {
             if (hasTrailer) {
                // Di tablet (sm) grid-nya 2, jadi kita tampilkan 8. Di desktop (lg) grid-nya 1, kita tampilkan 4.
                if (idx >= 8) displayClass = "hidden";
                else if (idx >= 4) displayClass = "hidden sm:block lg:hidden"; 
             } else {
                // Mode Full layar, cut di item ke-12
                if (idx >= 12) displayClass = "hidden";
             }
          }

          return (
            <Link 
              href={`/anime/${anime.id}`}
              key={idx}
              // UKURAN TETAP SAMA KONSISTEN: h-[120px] sm:h-[130px]
              className={`relative w-full h-[120px] sm:h-[130px] rounded-xl overflow-hidden group border border-white/10 hover:border-white/30 active:border-white/30 active:scale-[0.98] transition-all duration-200 shrink-0 shadow-lg ${displayClass}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 group-active:scale-105 transition-transform duration-500" />
              
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] group-hover:bg-black/50 group-hover:backdrop-blur-none group-active:bg-black/50 group-active:backdrop-blur-none transition-all duration-300" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 drop-shadow-md text-slate-200 line-clamp-1">
                  {anime.typeLabel}
                </span>
                <span className="text-[13px] sm:text-[14px] font-bold text-white line-clamp-2 drop-shadow-md group-hover:text-white group-active:text-white transition-colors leading-tight">
                  {anime.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}