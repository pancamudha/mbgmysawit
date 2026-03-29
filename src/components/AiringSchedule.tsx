"use client";

import React from 'react';
import Link from 'next/link';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

interface ScheduleItem {
  id: string;
  data_id: string;
  title: string;
  japanese_title?: string;
  releaseDate: string;
  time: string;
  episode_no: string;
}

interface AiringScheduleProps {
  schedule: ScheduleItem[];
}

// Fungsi getDynamicGradient dari HeroCarousel untuk warna judul
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
  if (title) {
    for (let i = 0; i < title.length; i++) hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export default function AiringSchedule({ schedule }: AiringScheduleProps) {
  const { getTitle } = useAnimeTitle();

  if (!schedule || schedule.length === 0) return null;

  // Batasi hanya menampilkan 10 jadwal, sisanya diarahkan ke page schedule
  const displayedSchedule = schedule.slice(0, 10);

  return (
    <div className="w-full mt-10 sm:mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-[#2A2A2E] pb-3">
        <div className="flex items-center gap-2.5">
          <svg className="w-5 h-5 text-[#ffbade]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-white">
            Estimated Schedule
          </h2>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#8C8C8C] uppercase tracking-wider bg-[#141414] px-2.5 py-1 rounded-md border border-[#2A2A2E]">
          Today
        </span>
      </div>

      {/* Schedule List */}
      <div className="flex flex-col gap-1">
        {displayedSchedule.map((anime, idx) => {
          const displayTitle = getTitle(anime.title, anime.japanese_title);
          
          // Dapatkan gradasi warna yang sama seperti hero carousel berdasarkan judul bahasa Inggris
          const titleGradient = getDynamicGradient(anime.title || "Unknown");
          
          // Memecah waktu HH:MM untuk gaya abstrak
          const [hh, mm] = anime.time.split(':');

          return (
            <Link
              // Langsung mengarah ke link nonton episodenya!
              href={`/anime/${anime.id}?ep=${anime.episode_no}`}
              key={`${anime.id}-${idx}`}
              className="group flex items-center justify-between py-3.5 sm:py-4 border-b border-[#2A2A2E]/60 hover:border-[#4A4A4E] transition-colors gap-4 sm:gap-5"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Waktu Gaya Abstrak - Diperkecil dan warnanya selalu putih tegas */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center rounded-lg bg-[#141414] border border-[#2A2A2E] group-hover:border-white/30 transition-colors p-1">
                  <div className="flex items-end gap-0.5">
                    <span className="text-xl sm:text-2xl font-black text-white leading-none tracking-tighter font-mono">
                      {hh}
                    </span>
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-[7px] sm:text-[8px] font-bold text-[#ffbade]">MIN</span>
                      <span className="text-[11px] sm:text-[12px] font-black text-white font-mono">
                        {mm}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Judul Anime - Paling Besar, Mencolok, dan Punya Gradasi Warna Kayak Carousel */}
                <h3 className={`text-lg sm:text-xl font-black transition-all duration-300 leading-tight tracking-tight line-clamp-2 bg-gradient-to-r ${titleGradient} text-transparent bg-clip-text group-hover:opacity-80`}>
                  {displayTitle}
                </h3>
              </div>

              {/* Badge Episode Digabung dengan Efek Glass & Play Button */}
              <div className="shrink-0 pl-2">
                <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-black/30 backdrop-blur-md border border-white/10 text-[#8C8C8C] group-hover:text-[#ffbade] group-hover:border-[#ffbade]/40 group-hover:bg-[#ffbade]/10 font-bold text-[11px] sm:text-[12px] rounded-md shadow-sm transition-all duration-300">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>EP {anime.episode_no}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Tombol Read More */}
      <div className="mt-5 w-full">
        <Link 
          href="/schedule"
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2E] hover:bg-[#141414] hover:border-[#4A4A4E] hover:text-white text-[12px] sm:text-[13px] font-bold text-[#8C8C8C] transition-all group"
        >
          View More Schedule
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}