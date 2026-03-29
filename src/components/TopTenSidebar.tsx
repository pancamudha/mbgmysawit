"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

interface TopTenItem {
  id: string;
  data_id: string;
  number: string;
  title: string;
  japanese_title?: string;
  poster: string;
  tvInfo?: {
    sub?: string | number;
    dub?: string | number;
    eps?: string | number;
  };
}

interface TopTenData {
  today: TopTenItem[];
  week: TopTenItem[];
  month: TopTenItem[];
}

interface TopTenSidebarProps {
  data: TopTenData;
}

export default function TopTenSidebar({ data }: TopTenSidebarProps) {
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');
  const { getTitle } = useAnimeTitle();

  if (!data || (!data.today && !data.week && !data.month)) return null;

  const currentList = data[activeTab] || [];

  return (
    <div className="w-full mt-6">
      {/* Header & Tabs */}
      <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
        <svg className="w-[20px] h-[20px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-white">
          Top 10 Anime
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex w-full items-center border border-[#2A2A2E] rounded-lg overflow-hidden divide-x divide-[#2A2A2E] mb-4">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 flex justify-center items-center py-2 text-[12px] sm:text-[13px] font-bold tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'today' 
              ? 'bg-[#2A2A2E] text-white shadow-sm' 
              : 'bg-[#0f0f0f] text-[#8C8C8C] hover:bg-[#141414] hover:text-white'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('week')}
          className={`flex-1 flex justify-center items-center py-2 text-[12px] sm:text-[13px] font-bold tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'week' 
              ? 'bg-[#2A2A2E] text-white shadow-sm' 
              : 'bg-[#0f0f0f] text-[#8C8C8C] hover:bg-[#141414] hover:text-white'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setActiveTab('month')}
          className={`flex-1 flex justify-center items-center py-2 text-[12px] sm:text-[13px] font-bold tracking-wider transition-all whitespace-nowrap ${
            activeTab === 'month' 
              ? 'bg-[#2A2A2E] text-white shadow-sm' 
              : 'bg-[#0f0f0f] text-[#8C8C8C] hover:bg-[#141414] hover:text-white'
          }`}
        >
          Month
        </button>
      </div>

      {/* List Items */}
      <div className="flex flex-col gap-2.5">
        {currentList.map((anime, index) => {
          const displayTitle = getTitle(anime.title, anime.japanese_title);
          
          return (
            <Link
              href={`/anime/${anime.id}`}
              key={`${anime.id}-${activeTab}`}
              className="group relative flex items-center gap-3.5 p-2 rounded-xl overflow-hidden bg-[#141414] border border-white/5 hover:border-white/10 active:border-white/10 transition-all duration-300 shrink-0"
            >
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={anime.poster} alt="" className="w-full h-full object-cover scale-105 grayscale opacity-[0.25] group-hover:grayscale-0 group-hover:translate-x-[6px] group-hover:opacity-[0.6] group-active:grayscale-0 group-active:translate-x-[6px] group-active:opacity-[0.6] transition-all duration-500 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
              </div>

              {/* Rank Number - PERUBAHAN: Menyesuaikan ukuran teks tanpa menggeser layout */}
              <div 
                className={`w-8 shrink-0 text-center font-black z-10 transition-colors ${
                  index === 0 ? 'text-[26px] text-[#ffbade]' :
                  index === 1 ? 'text-[24px] text-[#c6a0ff]' :
                  index === 2 ? 'text-[22px] text-[#85c9ff]' :
                  'text-[20px] text-[#4A4A4E] group-hover:text-white'
                }`}
              >
                {anime.number}
              </div>

              {/* Poster */}
              <div className="w-[45px] h-[60px] sm:w-[54px] sm:h-[72px] rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
                <Image
                  src={anime.poster}
                  alt={displayTitle}
                  fill
                  sizes="(max-width: 768px) 45px, 54px"
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col flex-1 py-1 z-10 pr-2 transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
                <h3 className="text-white font-bold text-[13px] sm:text-[14px] leading-snug line-clamp-2 mb-1 group-hover:text-white/80 group-active:text-white/80 transition-colors drop-shadow-md">
                  {displayTitle}
                </h3>
                
                {/* Episodes (Sub/Dub) */}
                <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#8C8C8C] tracking-wider uppercase drop-shadow-md">
                  {anime.tvInfo?.sub && (
                    <span className="flex items-center gap-1 bg-[#1A1A1C] px-1.5 py-0.5 rounded text-[#85c9ff]">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z"/>
                      </svg>
                      {anime.tvInfo.sub}
                    </span>
                  )}
                  {anime.tvInfo?.dub && (
                    <span className="flex items-center gap-1 bg-[#1A1A1C] px-1.5 py-0.5 rounded text-[#ffbade]">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                      </svg>
                      {anime.tvInfo.dub}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}