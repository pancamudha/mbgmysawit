"use client";

import React from 'react';

export default function AnimeTrailer({ trailer }: { trailer: any }) {
  const hasTrailer = !!trailer?.url;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-bold text-white tracking-tight flex items-center gap-2">
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        Official Trailer
      </h2>

      <div 
        className={`w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl relative group ${
            hasTrailer 
            ? 'aspect-video lg:aspect-auto lg:h-[568px]' 
            : 'h-full min-h-[130px]'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-violet-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
        
        <div className="relative w-full h-full bg-[#0A0A0B] rounded-xl overflow-hidden z-10">
            {hasTrailer ? (
                <iframe 
                className="w-full h-full"
                src={trailer.url} 
                title={trailer.title || "YouTube video player"} 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F0F0F] text-[#8C8C8C]">
                    <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="font-medium text-sm">Trailer belum tersedia</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}