"use client";

import React, { useState, useEffect } from 'react';
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
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Update waktu setiap detik
  useEffect(() => {
    setCurrentTime(new Date()); // Set awal agar tidak kosong saat mount
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!schedule || schedule.length === 0) return null;

  const displayedSchedule = schedule.slice(0, 10);

  // Format waktu real-time
  const formatTime = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    
    return { dayName, fullDate: `${d}/${m}/${y}`, clock: `${hh}:${mm}:${ss}` };
  };

  const timeDisplay = currentTime ? formatTime(currentTime) : null;

  return (
    <div className="w-full mt-10 sm:mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-[#2A2A2E] pb-3 gap-3">
        
        {/* Bagian Kiri (Judul + Badge Mobile) */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-[#ffbade]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-white">
              Estimated Schedule
            </h2>
          </div>

          {/* Badge TODAY khusus Mobile (rata kanan) */}
          {timeDisplay && (
            <div className="flex sm:hidden items-center justify-center px-3 py-1.5 bg-[#0f0f0f] border border-[#2A2A2E] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
              Today
            </div>
          )}
        </div>

        {/* Bagian Kanan (Badge Desktop + Jam Full Width Mobile) */}
        {timeDisplay && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Badge TODAY khusus Desktop (Tersembunyi di Mobile) */}
            <div className="hidden sm:flex items-center justify-center px-3 py-1.5 bg-[#0f0f0f] border border-[#2A2A2E] text-white text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm">
              Today
            </div>

            {/* PERUBAHAN DI SINI: Kotak Waktu (justify-start agar rata kiri di mobile & desktop) */}
            <div className="flex items-center justify-start gap-2 px-3 py-1.5 bg-[#0f0f0f] border border-[#2A2A2E] rounded-lg w-full sm:w-auto">
              <span className="text-[10px] font-black text-[#ffbade] uppercase tracking-tighter shrink-0 bg-[#ffbade]/10 px-1.5 rounded">
                {timeDisplay.dayName}
              </span>
              <span className="text-[11px] font-mono font-bold text-white tracking-wider">
                {timeDisplay.fullDate}
              </span>
              <div className="w-[1px] h-3 bg-[#2A2A2E]"></div>
              <span className="text-[11px] font-mono font-black text-[#ffbade] tabular-nums">
                {timeDisplay.clock}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Schedule List */}
      <div className="flex flex-col gap-1">
        {displayedSchedule.map((anime, idx) => {
          const displayTitle = getTitle(anime.title, anime.japanese_title);
          const titleGradient = getDynamicGradient(anime.title || "Unknown");
          const [hh, mm] = anime.time.split(':');

          return (
            <Link
              href={`/anime/${anime.id}?ep=${anime.episode_no}`}
              key={`${anime.id}-${idx}`}
              className="group flex items-center justify-between py-3.5 sm:py-4 border-b border-[#2A2A2E]/60 hover:border-[#4A4A4E] transition-colors gap-4 sm:gap-5"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Waktu Gaya Abstrak */}
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
                
                {/* Judul Anime */}
                <h3 className={`text-lg sm:text-xl font-black transition-all duration-300 leading-tight tracking-tight line-clamp-2 bg-gradient-to-r ${titleGradient} text-transparent bg-clip-text group-hover:opacity-80`}>
                  {displayTitle}
                </h3>
              </div>

              {/* Badge Episode Glass */}
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

      {/* Tombol View Full Schedule */}
      <div className="mt-5 w-full">
        <Link 
          href="/schedule"
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg bg-[#0F0F0F] border border-[#2A2A2E] hover:bg-[#141414] hover:border-[#4A4A4E] hover:text-white text-[12px] sm:text-[13px] font-bold text-[#8C8C8C] transition-all group"
        >
          View Full Schedule
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}