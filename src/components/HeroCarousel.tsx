"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AnimeItem {
  title: string;
  slug: string;
  poster: string;
  current_episode: string;
  release_day?: string;
  synopsis?: string; 
  type?: string;
  status?: string;
  episode_count?: string;
  duration?: string;
}

// Algoritma Smart Hash untuk menghasilkan warna unik permanen berdasarkan Judul Anime
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
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export default function HeroCarousel({ animes }: { animes: AnimeItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselAnimes = animes.slice(0, 10);

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
          
          const dummyDuration = 23 + (anime.title.length % 3);
          
          // Dapatkan warna gradient unik untuk anime ini
          const titleGradient = getDynamicGradient(anime.title);

          return (
            <div key={anime.slug} className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              
              {/* Latar Belakang Gambar */}
              <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={anime.poster} 
                  alt={anime.title} 
                  className="w-full h-full object-cover object-[center_20%] opacity-90" 
                />
              </div>
              
              {/* Gradasi Hitam */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent h-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/60 to-transparent w-[85%] md:w-[65%]" />

              {/* === Navigasi Atas === */}
              <div className="absolute top-0 left-0 w-full p-4 sm:p-5 md:p-6 z-30 flex items-center justify-between">
                
                {/* Info Episode SAJA */}
                <div className="flex items-center gap-1.5 sm:gap-2 h-7 sm:h-8 px-2.5 sm:px-3 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 shadow-sm">
                  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wider uppercase">
                    {anime.current_episode}
                  </span>
                </div>

                {/* Paginasi */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button onClick={handlePrev} className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/30 hover:bg-white/10 backdrop-blur-md border border-white/10 items-center justify-center text-white transition-colors shadow-sm" aria-label="Previous Slide">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  
                  <div className="h-9 sm:h-10 px-3 sm:px-3.5 rounded-lg bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white shadow-sm min-w-[56px] sm:min-w-[64px]">
                    <span className="text-[13px] sm:text-[15px] font-black -translate-y-[1px]">
                      {currentIndex + 1}
                    </span>
                    <span className="text-white/30 mx-1.5 text-[11px] sm:text-[12px] font-bold rotate-12">
                      /
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/80 font-bold translate-y-[2px]">
                      {carouselAnimes.length}
                    </span>
                  </div>

                  <button onClick={handleNext} className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-black/30 hover:bg-white/10 backdrop-blur-md border border-white/10 items-center justify-center text-white transition-colors shadow-sm" aria-label="Next Slide">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              {/* === Konten Utama Bawah === */}
              <div className="absolute bottom-0 left-0 w-full p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 z-20">
                
                {/* Info & Judul */}
                <div className="flex-1 max-w-[650px] flex flex-col items-center text-center sm:items-start sm:text-left mx-auto sm:mx-0">
                  
                  {/* Meta Info Dinamis */}
                  <div className="flex items-center justify-center sm:justify-start flex-wrap gap-2 text-[9px] sm:text-[11px] md:text-xs font-semibold text-slate-300 mb-1.5 sm:mb-2 uppercase tracking-wide">
                    
                    <span className="text-white">{anime.type || 'TV'}</span>
                    
                    {anime.release_day && (
                      <>
                        <span className="text-slate-600 text-[8px]">•</span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {anime.release_day}
                        </span>
                      </>
                    )}
                    
                    <span className="text-slate-600 text-[8px]">•</span>
                    <span className={anime.status?.toLowerCase() === 'completed' ? "text-indigo-400" : "text-emerald-400"}>
                      {anime.status ? anime.status.toUpperCase() : 'ONGOING'}
                    </span>
                    
                    <span className="text-slate-600 text-[8px]">•</span>
                    <span>{anime.episode_count ? `${anime.episode_count} Episodes` : anime.current_episode}</span>
                    
                    <span className="text-slate-600 text-[8px]">•</span>
                    <span>{dummyDuration}m</span>
                  </div>
                  
                  {/* Judul dengan Dinamik Gradient dari fungsi getDynamicGradient */}
                  <h1 className={`text-2xl sm:text-3xl md:text-[36px] font-extrabold leading-[1.1] mb-1.5 sm:mb-2 drop-shadow-md line-clamp-2 tracking-tight bg-gradient-to-r ${titleGradient} text-transparent bg-clip-text`}>
                    {anime.title}
                  </h1>
                  
                  {/* Deskripsi Asli */}
                  <p className="text-[11px] sm:text-xs md:text-[13px] leading-relaxed text-slate-400 line-clamp-3 sm:line-clamp-2 max-w-[550px] mb-3 sm:mb-0">
                    {anime.synopsis || `Saksikan kisah perjalanan seru dan aksi mendebarkan di dunia penuh intrik. Jangan lewatkan kelanjutan cerita karakter favorit Anda dalam episode terbaru ini.`}
                  </p>
                </div>

                {/* Tombol Aksi */}
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
                  <Link href={`/anime/${anime.slug}`} className="bg-white hover:bg-slate-200 text-black font-bold py-2.5 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-sm flex-1 sm:flex-none shadow-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg> Watch Now
                  </Link>
                  <Link href={`/anime/${anime.slug}`} className="bg-black/30 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white font-medium py-2.5 sm:py-2.5 px-4 sm:px-5 rounded-lg transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-sm flex-1 sm:flex-none shadow-lg">
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