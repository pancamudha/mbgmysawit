"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import type { ScheduleItem } from "@/app/schedule/page";
import { getPosterFromDetail } from "@/lib/api"; 

interface AnimeCardProps {
  item: ScheduleItem;
  selectedDate: Date;
  currentTime: Date;
}

export default function AnimeCard({ item, selectedDate, currentTime }: AnimeCardProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(item.poster || null);

  useEffect(() => {
    let isMounted = true;
    
    if (!posterUrl && item.id) {
      getPosterFromDetail(item.id).then((img) => {
        if (isMounted && img) {
          setPosterUrl(img);
        }
      });
    }
    
    return () => {
      isMounted = false;
    };
  }, [item.id, posterUrl]);

  const formattedTime = item.time;

  const getStatus = () => {
    const today = new Date(currentTime);
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(selectedDate);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate.getTime() < today.getTime()) return "AIRED";
    if (targetDate.getTime() > today.getTime()) return "AIRING";

    const [hours, minutes] = item.time.split(':').map(Number);
    const itemMinutes = hours * 60 + minutes;
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    return itemMinutes <= currentMinutes ? "AIRED" : "AIRING";
  };

  const status = getStatus();

  return (
    <Link 
      href={`/anime/${item.id}`} 
      className="group relative flex items-center gap-3.5 p-2 h-[75px] sm:h-[82px] w-full bg-[#141414] rounded-xl border border-white/5 hover:border-white/10 active:border-white/10 transition-all duration-300 shrink-0 overflow-hidden"
    >
      {/* --- BACKGROUND BANNER TRANSLUCENT & HOVER EFFECTS --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {posterUrl && (
          <img 
            src={posterUrl} 
            alt="" 
            className="w-full h-full object-cover scale-105 grayscale opacity-[0.25] group-hover:grayscale-0 group-hover:translate-x-[6px] group-hover:opacity-[0.6] group-active:grayscale-0 group-active:translate-x-[6px] group-active:opacity-[0.6] transition-all duration-500 ease-out" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
      </div>

      {/* --- FOREGROUND POSTER --- */}
      <div className="w-[48px] sm:w-[54px] h-full rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
        {posterUrl ? (
          <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <Play className="w-4 h-4 text-[#555]" />
          </div>
        )}
      </div>
      
      {/* --- CENTER TEXT (TITLE & EP) --- */}
      <div className="flex flex-col justify-center h-full flex-1 min-w-0 z-10 transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
        <h4 className="text-white font-bold text-[13px] sm:text-[14px] leading-snug line-clamp-2 mb-0.5 group-hover:text-white/80 group-active:text-white/80 transition-colors drop-shadow-md">
          {item.title}
        </h4>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#8C8C8C] tracking-wider uppercase drop-shadow-md">
          EP {item.episode_no}
        </span>
      </div>

      {/* --- RIGHT TEXT (TIME & STATUS) --- */}
      <div className="flex flex-col items-end justify-center h-full shrink-0 pr-2 z-10 transition-transform duration-500 group-hover:translate-x-1 group-active:translate-x-1">
         <span className={`text-[16px] sm:text-[18px] font-black leading-none drop-shadow-md transition-colors ${status === 'AIRED' ? 'text-[#8C8C8C]' : 'text-white'}`}>
           {formattedTime}
         </span>
         <span className={`text-[8px] sm:text-[9px] font-bold tracking-widest mt-1 uppercase drop-shadow-md transition-colors ${status === 'AIRED' ? 'text-[#4A4A4E]' : 'text-white/80'}`}>
           {status}
         </span>
      </div>
    </Link>
  );
}