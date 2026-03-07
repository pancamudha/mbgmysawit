"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function AnimeHero({ anime }: { anime: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!anime) return null;

  const firstEpisodeSlug = anime.id || '#';

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // LOGIKA RATING DIPERBAIKI: MAL Score jadi prioritas utama
  let rating = anime.animeInfo?.['MAL Score'];
  if (!rating || rating === '?') {
    rating = anime.animeInfo?.tvInfo?.rating;
  }

  const studios = anime.animeInfo?.Studios;
  const producers = anime.animeInfo?.Producers?.join(', ');

  // =========================================
  // LOGIKA FORMAT TANGGAL & STATUS (BARU)
  // =========================================
  
  // 1. Logika Tanggal: Prioritas Premiered (Musim), fallback ke Aired (Tanggal)
  const premieredDate = anime.animeInfo?.Premiered?.replace(/-/g, ' ');
  const airedDate = anime.animeInfo?.Aired?.split('-to-')[0]?.replace(/-/g, ' ');
  const displayDate = premieredDate && premieredDate !== '?' ? premieredDate : airedDate;

  // 2. Logika Status: Menyingkat teks status agar lebih rapi
  let rawStatus = anime.animeInfo?.Status?.replace(/-/g, ' ') || 'Releasing';
  let displayStatus = rawStatus;
  if (rawStatus.toLowerCase() === 'currently airing') {
      displayStatus = 'Releasing';
  } else if (rawStatus.toLowerCase() === 'finished airing') {
      displayStatus = 'Finished';
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-start gap-6 md:gap-8 lg:gap-10">
      
      {/* === POSTER KIRI === */}
      <div className="w-[160px] sm:w-[220px] md:w-[260px] shrink-0 mx-auto md:mx-0 flex flex-col gap-3 sm:gap-4">
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
          
          {/* Rating Badge */}
          {rating && rating !== '?' && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-lg">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="text-white text-[11px] sm:text-xs font-bold leading-none translate-y-[1px]">
                {rating}
              </span>
            </div>
          )}
        </div>

        {/* Info Desktop Only */}
        {(studios || producers) && (
          <div className="hidden md:flex flex-col gap-1.5 text-[12px] text-[#8C8C8C] text-left px-1">
            {studios && (
              <p><span className="font-semibold text-slate-300">Studio:</span> {studios}</p>
            )}
            {producers && (
              <p><span className="font-semibold text-slate-300">Producers:</span> {producers}</p>
            )}
          </div>
        )}
      </div>

      {/* === INFO KANAN === */}
      <div className="flex-1 flex flex-col items-center text-center md:items-start md:text-left mt-2 md:mt-0 w-full">
        
        {/* Meta Badges */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2.5">
          <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 text-[11px] sm:text-xs font-semibold uppercase">
            {anime.showType || 'TV'}
          </span>
          <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 text-[11px] sm:text-xs font-semibold capitalize">
            {displayStatus}
          </span>
          {displayDate && (
            <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {displayDate}
            </span>
          )}
          {(anime.animeInfo?.tvInfo?.eps || anime.animeInfo?.tvInfo?.sub) && (
            <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 text-[11px] sm:text-xs font-semibold">
              {anime.animeInfo?.tvInfo?.eps || anime.animeInfo?.tvInfo?.sub} eps
            </span>
          )}
          {anime.animeInfo?.tvInfo?.duration && (
            <span className="px-2.5 py-1 rounded border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {anime.animeInfo.tvInfo.duration}
            </span>
          )}
        </div>

        {/* Judul */}
        <div className="mb-2.5">
          <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black text-white leading-[1.1] mb-1 uppercase tracking-tight">
            {anime.title}
          </h1>
          {anime.japanese_title && (
            <h2 className="text-base sm:text-lg font-bold text-[#8C8C8C] tracking-wide">
              {anime.japanese_title}
            </h2>
          )}
        </div>

        {/* Genres */}
        {anime.animeInfo?.Genres && anime.animeInfo.Genres.length > 0 && (
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-5">
            {anime.animeInfo.Genres.map((g: string, idx: number) => (
              <span key={idx} className="px-3.5 py-1 rounded-full border border-white/10 bg-transparent text-[#A0A0A0] text-[11px] sm:text-xs font-medium">
                {g.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Sinopsis */}
        <div className="mb-6 max-w-[800px]">
          <p className={`text-[#8C8C8C] text-[13px] sm:text-[14px] leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
            {anime.animeInfo?.Overview || 'Sinopsis belum tersedia.'}
          </p>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white font-bold text-[13px] mt-1.5 flex items-center gap-1 mx-auto md:mx-0"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
            <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center flex-wrap justify-center md:justify-start gap-3 sm:gap-4 w-full">
          <Link href={`/watch/${firstEpisodeSlug}`} className="bg-white hover:bg-slate-200 text-black font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-sm shadow-lg shadow-white/5">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Watch Now
          </Link>
          
          <button
            onClick={toggleFavorite}
            className={`font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-sm border ${
                isFavorite 
                ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20' 
                : 'bg-transparent border-[#2A2A2E] text-white hover:bg-white/5'
            }`}
          >
             {isFavorite ? (
                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
             ) : (
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
             )}
            {isFavorite ? 'Favorited' : 'Add to Favorite'}
          </button>
        </div>

        {/* Info Mobile Only */}
        {(studios || producers) && (
          <div className="flex md:hidden flex-col items-center gap-1.5 text-[11px] text-[#8C8C8C] w-full mt-6 pt-5 border-t border-white/5">
            {studios && (
              <p><span className="font-semibold text-slate-400">Studio:</span> {studios}</p>
            )}
            {producers && (
              <p className="text-center"><span className="font-semibold text-slate-400">Producers:</span> {producers}</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}