"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, CalendarClock, Play } from "lucide-react";
import { getScheduleAction } from "@/lib/actions";
import DaySelector from "@/components/Schedule/DaySelector";
import AnimeCard from "@/components/Schedule/AnimeCard";
import { getPosterFromDetail } from "@/lib/api"; 
import LoadingScreen from "@/components/LoadingScreen";

export interface ScheduleItem {
  id: string;
  data_id: string;
  title: string;
  japanese_title?: string;
  releaseDate: string;
  time: string;
  episode_no: string;
  poster?: string;
}

export interface GroupedSchedule {
  [time: string]: ScheduleItem[];
}

// Komponen mini untuk Highlight Card
function HighlightCard({ item }: { item: ScheduleItem }) {
  const [posterUrl, setPosterUrl] = useState<string | null>(item.poster || null);

  useEffect(() => {
    let isMounted = true;
    if (!posterUrl && item.id) {
      getPosterFromDetail(item.id).then((img) => {
        if (isMounted && img) setPosterUrl(img);
      });
    }
    return () => { isMounted = false; };
  }, [item.id, posterUrl]);

  return (
    <Link 
      href={`/anime/${item.id}`} 
      className="group relative flex items-center justify-between p-3 sm:p-4 h-[110px] sm:h-[120px] bg-[#141414] border border-white/5 rounded-[10px] overflow-hidden hover:border-white/10 active:border-white/10 transition-all duration-300"
    >
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0A]">
        {posterUrl && (
          <img 
            src={posterUrl} 
            alt="" 
            className="w-full h-full object-cover scale-105 grayscale opacity-[0.25] group-hover:grayscale-0 group-hover:-translate-x-[6px] group-hover:opacity-[0.6] group-active:grayscale-0 group-active:-translate-x-[6px] group-active:opacity-[0.6] transition-all duration-500 ease-out" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent w-[85%]" />
      </div>

      <div className="relative z-10 flex flex-col justify-center gap-2 h-full w-[65%] pl-2 sm:pl-3 transition-transform duration-500 group-hover:-translate-x-1 group-active:-translate-x-1">
        <h4 className="text-white font-bold text-[14px] sm:text-[15px] leading-snug line-clamp-2 drop-shadow-md group-hover:text-white/80 group-active:text-white/80 transition-colors">
          {item.title}
        </h4>
        
        <div className="flex items-center gap-2 drop-shadow-md">
          <span className="px-2.5 py-0.5 rounded-[6px] bg-black/30 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white border border-white/10 shadow-sm">
            EP {item.episode_no}
          </span>
          <span className="px-2.5 py-0.5 rounded-[6px] bg-black/30 backdrop-blur-md text-[10px] sm:text-[11px] font-bold text-white border border-white/10 shadow-sm">
            {item.time}
          </span>
        </div>
      </div>

      <div className="relative z-10 w-[55px] sm:w-[65px] h-full rounded-[6px] overflow-hidden bg-[#1A1A1C] shrink-0 border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:-translate-x-1 group-active:-translate-x-1">
        {posterUrl ? (
          <img src={posterUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center animate-pulse">
            <Play className="w-5 h-5 text-[#555]" />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); 
    return () => clearInterval(timer);
  }, []);

  const getWeekDates = (baseDate: Date) => {
    const dayOfWeek = baseDate.getDay(); 
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - dayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  };

  const dateList = getWeekDates(selectedDate);

  useEffect(() => {
    const fetchSchedule = async () => {
      setIsLoading(true);
      try {
        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${yyyy}-${mm}-${dd}`;
        const tzOffset = new Date().getTimezoneOffset();
        
        const data = await getScheduleAction(dateStr, tzOffset);
        setScheduleData(Array.isArray(data) ? data : data?.results || data?.data || []);
      } catch (error) {
        console.error("Error fetching schedule:", error);
        setScheduleData([]);
      } finally {
        // Beri sedikit delay agar transisi LoadingScreen smooth
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchSchedule();
  }, [selectedDate]);

  const groupedSchedule: GroupedSchedule = scheduleData.reduce((acc, item) => {
    if (!acc[item.time]) acc[item.time] = [];
    acc[item.time].push(item);
    return acc;
  }, {} as GroupedSchedule);

  const sortedTimes = Object.keys(groupedSchedule).sort();

  const highlightItems = useMemo(() => {
    if (!scheduleData.length) return [];
    const isToday = selectedDate.toDateString() === currentTime.toDateString();
    if (!isToday) return scheduleData.slice(0, 3);

    const currentTotalMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const airedItems = scheduleData
      .map(item => {
        const [h, m] = item.time.split(':').map(Number);
        return { ...item, diff: currentTotalMinutes - (h * 60 + m) };
      })
      .filter(item => item.diff >= 0)
      .sort((a, b) => a.diff - b.diff);

    return airedItems.length > 0 ? airedItems.slice(0, 3) : scheduleData.slice(0, 3);
  }, [scheduleData, selectedDate, currentTime]);

  const getGridClass = (count: number) => {
    if (count === 3) return "grid-cols-1 lg:grid-cols-3"; 
    if (count >= 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"; 
    return "grid-cols-1 lg:grid-cols-2"; 
  };

  // Jika Loading, tampilkan LoadingScreen menutupi seluruh konten
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 md:px-8 pb-2 pt-[8px] md:pt-[12px] font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full">
          
          {/* --- HIGHLIGHT SECTION --- */}
          {highlightItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6 sm:mb-8">
              {highlightItems.map((item, idx) => (
                <HighlightCard key={`highlight-${idx}`} item={item} />
              ))}
            </div>
          )}

          {/* --- DAY SELECTOR --- */}
          <DaySelector dates={dateList} selectedDate={selectedDate} onSelect={setSelectedDate} />

          {/* --- TIMELINE SECTION --- */}
          <div className="-mt-4 sm:mt-3 pb-10">
            {scheduleData.length > 0 ? (
              <div className="relative">
                <div className="absolute w-[2px] bg-[#222222] left-[4px] top-[8px] sm:top-[9px] bottom-0 z-0"></div>
                <div className="flex flex-col gap-5 sm:gap-6">
                  {sortedTimes.map((time, idx) => {
                    const items = groupedSchedule[time];
                    return (
                      <div key={idx} className="relative pl-6 sm:pl-7">
                        <div className="absolute w-[10px] h-[10px] bg-[#E5E5E5] rounded-full left-0 top-[8px] sm:top-[9px] z-10"></div>
                        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
                          <ChevronRight className="w-[18px] h-[18px] text-[#777777]" strokeWidth={3} />
                          <h3 className="text-[17px] sm:text-[19px] font-bold text-[#E5E5E5] tracking-wide">{time}</h3>
                        </div>
                        <div className={`grid ${getGridClass(items.length)} gap-y-2 sm:gap-y-2.5 gap-x-3 sm:gap-x-4`}>
                          {items.map((item, itemIdx) => (
                            <AnimeCard key={itemIdx} item={item} selectedDate={selectedDate} currentTime={currentTime} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-[#555555]">
                <CalendarClock className="w-12 h-12 mb-4 opacity-30" />
                <p className="text-[15px] font-medium text-[#777777]">No series airing on this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}