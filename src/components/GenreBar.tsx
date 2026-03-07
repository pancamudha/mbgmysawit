"use client";

import React, { useRef } from 'react';
import Link from 'next/link';

interface GenreBarProps {
  genres?: string[];
}

export default function GenreBar({ genres = [] }: GenreBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Jika API gagal atau kosong, kita kasih fallback default
  const defaultGenres = [
    "action", "adventure", "comedy", "drama", "ecchi", "fantasy", 
    "horror", "mecha", "music", "mystery", "psychological", 
    "romance", "sci-fi", "slice-of-life", "sports", "supernatural", "thriller"
  ];

  const displayGenres = genres.length > 0 ? genres : defaultGenres;

  // Fungsi untuk menggeser scroll bar
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; 
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Fungsi untuk merapikan "martial-arts" jadi "Martial Arts" di tampilan UI
  const formatGenreName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-1.5 pt-1">
      <div className="relative group flex items-center">
        
        {/* === Gradasi Hitam Kiri === */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent pointer-events-none z-10 rounded-l-lg"></div>
        
        {/* === Tombol Geser Kiri === */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0A0A0B] hover:bg-[#141414] border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
          aria-label="Scroll Left"
        >
          <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* === List Tombol Genre === */}
        <div 
          ref={scrollRef}
          className="flex-1 flex items-center gap-2 overflow-x-auto whitespace-nowrap py-1.5 px-12 sm:px-16 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth z-0"
        >
          {displayGenres.map((genreStr) => (
            <Link 
              key={genreStr} 
              // API sudah kasih slug murni (huruf kecil dan pakai strip)
              href={`/genres/${genreStr}`}
              className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2E] hover:border-[#4A4A4E] text-[#8C8C8C] hover:text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 shadow-inner"
            >
              {formatGenreName(genreStr)}
            </Link>
          ))}
        </div>

        {/* === Gradasi Hitam Kanan === */}
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent pointer-events-none z-10 rounded-r-lg"></div>

        {/* === Tombol Geser Kanan === */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0A0A0B] hover:bg-[#141414] border border-[#2A2A2E] hover:border-[#4A4A4E] flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-xl"
          aria-label="Scroll Right"
        >
          <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>
    </div>
  );
}