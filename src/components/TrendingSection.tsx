"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

interface TrendingAnime {
  id: string;
  data_id: string;
  number: string;
  poster: string;
  title: string;
  japanese_title?: string;
}

interface TrendingSectionProps {
  animes: TrendingAnime[];
}

export default function TrendingSection({ animes }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!animes || animes.length === 0) return null;

  // Fungsi untuk menggeser ke kanan (Next)
  const scrollNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  // Fungsi untuk menggeser ke kiri (Prev)
  const scrollPrev = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-8 sm:mb-10 w-full">
      {/* Header Section - Diperbarui menyerupai LatestEpisodes */}
      <div className="flex justify-between items-end mb-3 sm:mb-4 gap-4">
        <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-white flex items-center gap-2.5">
          <svg className="w-[22px] h-[22px] text-[#ffbade]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
          Trending
        </h2>
        <Link 
          href="/trending" 
          className="text-sm text-[#8C8C8C] hover:text-white active:text-white transition-colors flex items-center gap-1.5 font-medium pb-0.5"
        >
          View more 
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Wrapper untuk Carousel + Navigation Buttons */}
      <div className="flex gap-4">
        
        {/* Carousel Track */}
        <div 
          ref={scrollRef}
          className="flex flex-1 gap-4 overflow-hidden scroll-smooth"
        >
          {animes.map((anime) => (
            <Link
              href={`/anime/${anime.id}`}
              key={anime.id}
              className={`flex h-[260px] bg-[#1f222a] rounded-xl overflow-hidden shrink-0 hover:scale-[1.02] transition-transform duration-300
                w-[calc((100%-16px)/2)]      /* Mobile: 2 card */
                sm:w-[calc((100%-32px)/3)]   /* Tablet: 3 card */
                lg:w-[calc((100%-48px)/4)]   /* Layar sedang: 4 card */
                xl:w-[calc((100%-64px)/5)]   /* Desktop: Tepat 5 card! */
              `}
            >
              {/* Bagian Kiri (Judul Vertical & Angka) */}
              <div className="w-[40px] shrink-0 flex flex-col justify-between items-center py-2 bg-[#0F0F0F] border-r border-[#2A2A2E]">
                <div className="flex-1 w-full overflow-hidden flex justify-center mt-1">
                  <span
                    className="text-gray-300 text-sm font-medium whitespace-nowrap"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    title={anime.title}
                  >
                    {anime.title}
                  </span>
                </div>
                <span className="text-[#ffbade] font-bold text-2xl leading-none mt-4 shrink-0">
                  {anime.number}
                </span>
              </div>

              {/* Bagian Kanan (Poster) */}
              <div className="flex-1 relative shrink-0">
                <Image
                  src={anime.poster}
                  alt={anime.title}
                  fill
                  sizes="(max-width: 768px) 140px, 200px"
                  className="object-cover"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Tombol Navigasi */}
        <div className="hidden sm:flex flex-col bg-[#0F0F0F] w-[40px] h-[260px] rounded-xl shrink-0 border border-[#2A2A2E]">
          <button 
            onClick={scrollNext} 
            className="flex-1 flex items-center justify-center text-gray-400 hover:text-[#ffbade] hover:bg-[#161616] transition-colors rounded-t-xl group"
            aria-label="Geser Kanan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-active:scale-90 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          {/* Garis pemisah tombol */}
          <div className="w-full h-[1px] bg-[#2A2A2E]"></div>
          
          <button 
            onClick={scrollPrev} 
            className="flex-1 flex items-center justify-center text-gray-400 hover:text-[#ffbade] hover:bg-[#161616] transition-colors rounded-b-xl group"
            aria-label="Geser Kiri"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-active:scale-90 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}