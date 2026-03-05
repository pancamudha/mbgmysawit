"use client";

import React, { useState } from 'react';

export default function AnimeCharacters({ characters }: { characters?: any[] }) {
  const [isViewAll, setIsViewAll] = useState(false);

  // === BAGIAN 1: EMPTY STATE ===
  if (!characters || characters.length === 0) {
      return (
        <div className="w-full">
            <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-white mb-4 sm:mb-5 flex items-center gap-2.5">
              Characters
            </h2>
            <div className="w-full h-[100px] border border-white/5 rounded-xl bg-[#141414]/40 flex items-center justify-center">
                <span className="text-[#8C8C8C] text-[13px] sm:text-sm font-medium px-4 text-center">
                  Data karakter belum tersedia.
                </span>
            </div>
        </div>
      );
  }

  // === BAGIAN 2: CONTENT STATE ===
  return (
    <div className="w-full">
      
      {/* Header with View All Button */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-white flex items-center gap-2.5">
          Characters
        </h2>
        
        {characters.length > 4 && (
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {characters.map((char, index) => {
          
          let displayClass = "flex"; 
          if (!isViewAll) {
             if (index >= 8) displayClass = "hidden"; 
             else if (index >= 4) displayClass = "hidden md:flex"; 
          }

          return (
            <div 
              key={index} 
              className={`group items-center justify-between bg-[#0F0F0F] border border-[#1F1F1F] rounded-xl p-2.5 transition-colors hover:border-[#3A3A3E] active:border-[#3A3A3E] shadow-sm ${displayClass}`}
            >
              
              {/* Kiri: Karakter */}
              <div className="flex items-center gap-3 w-1/2 overflow-hidden">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 border border-[#1F1F1F]/50">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={char.image} alt={char.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-[13px] sm:text-[14px] font-bold text-slate-200 line-clamp-1 truncate" title={char.name}>
                    {char.name}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#8C8C8C] font-medium mt-0.5 capitalize tracking-wide">
                    {char.role ? char.role.toLowerCase() : ''}
                  </span>
                </div>
              </div>

              {/* Kanan: Seiyuu */}
              {char.voice_actor ? (
                <div className="flex items-center justify-end gap-3 w-1/2 overflow-hidden text-right">
                  <div className="flex flex-col min-w-0 pl-2">
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#8C8C8C] line-clamp-1 truncate" title={char.voice_actor.name}>
                      {char.voice_actor.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-[#555] font-medium mt-0.5">
                      Voice Actor
                    </span>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 border border-[#1F1F1F]/50">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     {/* PERUBAHAN: Ditambahkan 'group-active:grayscale-0 group-active:opacity-100' untuk support HP */}
                     <img 
                        src={char.voice_actor.image} 
                        alt={char.voice_actor.name} 
                        className="w-full h-full object-cover grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100" 
                     />
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-[#444] w-1/2 text-right italic pr-2">
                  Unknown VA
                </div>
              )}
              
            </div>
          );
        })}
      </div>

    </div>
  );
}