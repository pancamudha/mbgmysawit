"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { useAnimeTitle } from "@/context/TitleLanguageContext";

interface AnimeItem {
  id: string;
  title: string;
  japanese_title?: string;
  poster: string;
  status?: string;
  tvInfo: {
    showType: string;
    duration: string;
    sub: number | null;
    dub: number | null;
    eps: number | null;
    releaseDate?: string;
  };
}

export function AnimeCardClient({ anime, fallbackYear }: { anime: AnimeItem, fallbackYear: string }) {
  const { getTitle } = useAnimeTitle();
  
  const sub = anime.tvInfo?.sub;
  const eps = anime.tvInfo?.eps;
  const showType = anime.tvInfo?.showType || 'TV';
  const releaseYear = anime.tvInfo?.releaseDate ? anime.tvInfo.releaseDate.split(', ').pop() : fallbackYear;
  const epsCount = eps || sub || '';
  
  const displayTitle = getTitle(anime.title, anime.japanese_title);

  return (
    <Link href={`/anime/${anime.id}`} className="group cursor-pointer flex flex-col active:scale-[0.98] transition-transform duration-200">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1A1A1C] mb-2.5 group-hover:ring-2 group-active:ring-2 ring-white/10 transition-all duration-300 group-hover:-translate-y-1.5 group-active:-translate-y-1.5">
        <Image
          src={anime.poster}
          alt={displayTitle}
          fill
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 group-active:bg-black/50 transition-colors duration-300 z-20 flex items-center justify-center">
          <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white opacity-0 group-hover:opacity-100 group-active:opacity-100 hover:scale-120 transition-all duration-300 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.89 10.363l-10.29-6.39c-1.258-.781-2.9.117-2.9 1.637v12.78c0 1.52 1.642 2.418 2.9 1.637l10.29-6.39c1.218-.756 1.218-2.518 0-3.274z"/>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80 z-10" />
      </div>
      <div className="flex items-start gap-1.5">
        <h3 className="text-[13px] sm:text-[14px] font-bold line-clamp-1 group-hover:text-indigo-400 group-active:text-indigo-400 transition-colors text-white leading-snug">
          {displayTitle}
        </h3>
      </div>
      
      {/* TETAP MENYAMPING: Dihapus efek turun ke bawah saat sidebar terbuka */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0.5 sm:gap-2 mt-1 text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wide">
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
}