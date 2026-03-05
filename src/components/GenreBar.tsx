"use client";

import React, { useRef } from 'react';
import Link from 'next/link';

export default function GenreBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Daftar genre sesuai standar anime
  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", 
    "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", 
    "Psychological", "Romance", "Sci-Fi", "Slice of Life", 
    "Sports", "Supernatural", "Thriller"
  ];

  // Fungsi untuk menggeser scroll bar saat tombol panah ditekan
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Jarak geser per klik
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-1.5 pt-1">
      <div className="relative group flex items-center">
        
        {/* === Gradasi Hitam Kiri (Diperpanjang agar tidak nabrak) === */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-32 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent pointer-events-none z-10 rounded-l-lg"></div>
        
        {/* === Tombol Geser Kiri === */}
        {/* Warna border diubah ke #2A2A2E agar lebih terang dan terpisah dari background */}
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
          {genres.map((genre) => (
            <Link 
              key={genre} 
              href={`/genres/${genre.toLowerCase().replace(' ', '-')}`}
              className="bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2E] hover:border-[#4A4A4E] text-[#8C8C8C] hover:text-white px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all shrink-0 shadow-inner"
            >
              {genre}
            </Link>
          ))}
        </div>

        {/* === Gradasi Hitam Kanan === */}
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-32 bg-gradient-to-l from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent pointer-events-none z-10 rounded-r-lg"></div>

        {/* === Tombol Geser Kanan === */}
        {/* Warna border diubah ke #2A2A2E agar lebih terang dan terpisah dari background */}
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