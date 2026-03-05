"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AnimeRelated({ relations }: { relations?: any[] }) {
  const [isViewAll, setIsViewAll] = useState(false);
  
  return (
    <div className="w-full">
      {/* Header dengan Tombol View All */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white tracking-tight">
           Related Anime
        </h2>

        {relations && relations.length > 4 && (
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

      {/* GRID CONFIGURATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
        
        {relations && relations.length > 0 ? (
          relations.map((anime, idx) => {
            
            // Logika sembunyikan item
            let displayClass = "block"; 
            if (!isViewAll) {
               if (idx >= 8) displayClass = "hidden";
               else if (idx >= 4) displayClass = "hidden sm:block lg:hidden"; 
            }

            return (
              <Link 
                href={`/search/${encodeURIComponent(anime.title)}`}
                key={idx}
                // PERUBAHAN: Tambahkan 'group' dan 'active:scale-[0.98]' untuk efek tekan di HP
                className={`relative w-full h-[120px] sm:h-[130px] rounded-xl overflow-hidden group border border-white/10 hover:border-white/30 active:border-white/30 active:scale-[0.98] transition-all duration-200 shrink-0 shadow-lg ${displayClass}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={anime.poster} 
                  alt={anime.title} 
                  className="w-full h-full object-cover object-center opacity-90 group-hover:scale-105 group-active:scale-105 transition-transform duration-500" 
                />
                
                {/* Overlay: Hover & Active */}
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] group-hover:bg-black/50 group-hover:backdrop-blur-none group-active:bg-black/50 group-active:backdrop-blur-none transition-all duration-300" />

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 drop-shadow-md ${
                    anime.type === 'SEQUEL' ? 'text-blue-400' : 
                    anime.type === 'PREQUEL' ? 'text-emerald-400' : 
                    anime.type === 'ALTERNATIVE' ? 'text-red-400' : 
                    'text-slate-200'
                  }`}>
                    {anime.type?.replace(/_/g, ' ') || 'RELATED'}
                  </span>
                  {/* Teks: Hover & Active */}
                  <span className="text-[13px] sm:text-[14px] font-bold text-white line-clamp-2 drop-shadow-md group-hover:text-white group-active:text-white transition-colors leading-tight">
                    {anime.title}
                  </span>
                  {anime.status && (
                     <span className="text-[10px] text-white/70 mt-1 uppercase bg-black/40 px-2 py-0.5 rounded">
                        {anime.status.replace(/_/g, ' ')}
                     </span>
                  )}
                </div>
              </Link>
            );
          })
        ) : (
          <div className="w-full h-[120px] sm:h-[130px] border border-white/5 rounded-xl bg-[#141414]/40 flex items-center justify-center shrink-0">
            <span className="text-[#8C8C8C] text-[13px] sm:text-sm font-medium px-4 text-center">
              Tidak ada seri terkait.
            </span>
          </div>
        )}

      </div>
    </div>
  );
}