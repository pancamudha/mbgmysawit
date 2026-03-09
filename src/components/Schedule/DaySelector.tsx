"use client";

import React, { useEffect, useRef } from "react";

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

interface DaySelectorProps {
  dates: Date[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export default function DaySelector({ dates, selectedDate, onSelect }: DaySelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-selected="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedDate]);

  const handleQuickFilter = (filter: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let targetDate = new Date(today);

    switch (filter) {
      case 'Yesterday':
        targetDate.setDate(today.getDate() - 1);
        break;
      case 'Today':
        break;
      case 'Tomorrow':
        targetDate.setDate(today.getDate() + 1);
        break;
      case 'Previous week':
        targetDate.setDate(today.getDate() - 7);
        break;
      case 'Next weekend':
        const dayOfWeek = today.getDay();
        const daysToSaturday = 6 - dayOfWeek;
        targetDate.setDate(today.getDate() + daysToSaturday);
        break;
    }
    
    onSelect(targetDate);
  };

  const getActiveFilter = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today); 
    yesterday.setDate(today.getDate() - 1);
    
    const tomorrow = new Date(today); 
    tomorrow.setDate(today.getDate() + 1);

    // PERBAIKAN: Menambahkan kalkulasi untuk Previous week dan Next weekend
    const previousWeek = new Date(today);
    previousWeek.setDate(today.getDate() - 7);

    const nextWeekend = new Date(today);
    const dayOfWeek = today.getDay();
    const daysToSaturday = 6 - dayOfWeek;
    nextWeekend.setDate(today.getDate() + daysToSaturday);

    // Cek urutan kecocokan
    if (isSameDay(selectedDate, today)) return 'Today';
    if (isSameDay(selectedDate, yesterday)) return 'Yesterday';
    if (isSameDay(selectedDate, tomorrow)) return 'Tomorrow';
    if (isSameDay(selectedDate, previousWeek)) return 'Previous week';
    if (isSameDay(selectedDate, nextWeekend)) return 'Next weekend';
    
    return null;
  };

  const activeFilter = getActiveFilter();

  return (
    <div className="w-full flex flex-col items-center justify-center mb-8">
      
      {/* Quick Filters (Miruro Style) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sm:mb-8">
        {['Yesterday', 'Today', 'Tomorrow', 'Previous week', 'Next weekend'].map((btn) => (
          <button 
            key={btn} 
            onClick={() => handleQuickFilter(btn)}
            className={`px-3 sm:px-4 py-1.5 rounded-[8px] text-[12px] sm:text-[13px] font-medium border transition-colors ${
              activeFilter === btn 
                ? 'bg-[#161616] text-white border-white/20' 
                : 'bg-[#0f0f0f] text-[#888888] border-[#222222] hover:bg-[#1A1A1A] hover:text-[#CCCCCC]'
            }`}
          >
            {btn}
          </button>
        ))}
      </div>

      <div 
        ref={scrollRef}
        className="flex items-center justify-start xl:justify-center gap-2 sm:gap-3 md:gap-4 overflow-x-auto w-full pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2"
      >
        {dates.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
          const monthDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

          return (
            <React.Fragment key={idx}>
              <div 
                onClick={() => onSelect(date)}
                data-selected={isSelected}
                className="flex flex-col items-center justify-center cursor-pointer group shrink-0"
              >
                <span 
                  className={`transition-all duration-200 tracking-tight whitespace-nowrap leading-none ${
                    isSelected 
                      ? "text-white text-[26px] sm:text-[30px] md:text-[36px] font-bold" 
                      : "text-[#555555] text-[20px] sm:text-[24px] md:text-[28px] font-bold group-hover:text-[#777777]"
                  }`}
                >
                  {dayName}
                </span>
                
                {isSelected && (
                  <span className="text-[11px] sm:text-[12px] md:text-[13px] text-[#888888] font-medium whitespace-nowrap mt-1.5 leading-none">
                    {monthDate}
                  </span>
                )}
              </div>
              
              {idx < dates.length - 1 && (
                <span className="text-[#333333] text-[22px] sm:text-[26px] md:text-[30px] font-light shrink-0 pb-1">
                  /
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}