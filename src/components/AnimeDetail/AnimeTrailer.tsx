"use client";

import React from 'react';

export default function AnimeTrailer({ trailer, hasRelated = false }: { trailer: any, hasRelated?: boolean }) {
  const hasTrailer = !!trailer?.url;
  
  if (!hasTrailer) return null;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white tracking-tight flex items-center gap-2">
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        Official Trailer
      </h2>

      <div 
        className={`w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl relative group ${
            hasRelated 
            // Jika ada sidebar related, kunci tinggi trailer sejajar dengan 4 card (568px)
            ? 'aspect-video lg:aspect-auto lg:h-[568px]' 
            // Jika tidak ada sidebar related (Full Width), gunakan natural aspect-video 16:9
            : 'aspect-video'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
        
        <div className="relative w-full h-full bg-[#0A0A0B] rounded-xl overflow-hidden z-10">
            <iframe 
               className="w-full h-full"
               src={trailer.url} 
               title={trailer.title || "YouTube video player"} 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
            />
        </div>
      </div>
    </div>
  );
}