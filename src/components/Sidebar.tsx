"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTitleLanguage } from '@/context/TitleLanguageContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage } = useTitleLanguage();

  // State untuk mengontrol kemunculan tooltip di mobile
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerTooltip = (id: string) => {
    setActiveTooltip(id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveTooltip(null);
    }, 2000);
  };

  const handleLanguageSelect = (lang: 'english' | 'romaji', tooltipId: string) => {
    setLanguage(lang);
    triggerTooltip(tooltipId);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-[60px] bg-[#0A0A0A]/80 backdrop-blur-xl z-40 h-[calc(100vh-60px)] py-6 px-3 flex flex-col items-start gap-2 border-r border-[#2A2A2E] w-[240px] -translate-x-full [.sidebar-expanded_&]:translate-x-0 transition-transform duration-300 ease-in-out">
      
      {/* Home */}
      <Link 
        href="/" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group ${
          isActive('/') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] shadow-sm hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">Home</span>
      </Link>
      
      {/* Explore */}
      <Link 
        href="/explore" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group ${
          isActive('/explore') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] shadow-sm hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">Explore</span>
      </Link>
      
      {/* Schedule */}
      <Link 
        href="/schedule" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group ${
          isActive('/schedule') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] shadow-sm hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">Schedule</span>
      </Link>
      
      {/* History */}
      <Link 
        href="/history" 
        className={`flex items-center gap-4 p-3 w-full rounded-xl transition-colors group ${
          isActive('/history') 
            ? 'text-white bg-[#0F0F0F] border border-[#2A2A2E] shadow-sm hover:bg-[#161616]' 
            : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F] border border-transparent'
        }`} 
      >
        <svg className="w-[22px] h-[22px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <path d="M12 7v5l4 2"></path>
        </svg>
        <span className="font-semibold text-[15px] whitespace-nowrap">History</span>
      </Link>

      {/* Spacer to push toggle down */}
      <div className="flex-1"></div>

      {/* Language Toggle */}
      <div className="w-full mt-auto mb-2 px-3 flex items-center gap-4">
        
        {/* Ikon Bahasa */}
        <div className="text-[#8C8C8C] shrink-0">
          <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
          </svg>
        </div>
        
        {/* Seamless Toggle Switch (EN | RO | JP) */}
        <div className="flex-1 flex bg-[#0A0A0A] border border-[#2A2A2E] rounded-[8px]">
          
          {/* EN Button */}
          <div className="relative group flex-1">
            <button 
              onClick={() => handleLanguageSelect('english', 'en')}
              className={`w-full py-1.5 text-[11px] font-bold transition-colors duration-200 tracking-widest rounded-l-[7px] ${
                language === 'english' 
                  ? 'bg-[#2A2A2E] text-white shadow-sm' 
                  : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F]'
              }`}
            >
              EN
            </button>
            {/* Custom Tooltip EN */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1F1F1F] border border-[#333333] text-white text-[11px] font-medium rounded-lg pointer-events-none transition-all duration-200 z-50 shadow-xl whitespace-nowrap ${activeTooltip === 'en' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`}>
              English
            </div>
          </div>
          
          {/* RO Button */}
          <div className="relative group flex-1">
            <button 
              onClick={() => handleLanguageSelect('romaji', 'ro')}
              className={`w-full py-1.5 text-[11px] font-bold transition-colors duration-200 tracking-widest border-x border-[#2A2A2E] ${
                language === 'romaji' 
                  ? 'bg-[#2A2A2E] text-white shadow-sm' 
                  : 'text-[#8C8C8C] hover:text-white hover:bg-[#0F0F0F]'
              }`}
            >
              RO
            </button>
            {/* Custom Tooltip RO */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1F1F1F] border border-[#333333] text-white text-[11px] font-medium rounded-lg pointer-events-none transition-all duration-200 z-50 shadow-xl whitespace-nowrap ${activeTooltip === 'ro' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`}>
              Japanese (Romaji)
            </div>
          </div>
          
          {/* JP Button (DISABLED - COMING SOON) */}
          <div className="relative group flex-1">
            <button 
              onClick={() => triggerTooltip('jp')}
              className={`w-full py-1.5 text-[11px] font-bold transition-colors duration-200 tracking-widest rounded-r-[7px] opacity-40 cursor-not-allowed text-[#8C8C8C] bg-[#0A0A0A]`}
            >
              JP
            </button>
            {/* Custom Tooltip JP (2 Baris Rata Tengah) */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1F1F1F] border border-[#333333] text-white text-[11px] font-medium rounded-lg pointer-events-none transition-all duration-200 z-50 shadow-xl whitespace-nowrap flex flex-col items-center justify-center leading-snug ${activeTooltip === 'jp' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'}`}>
              <span>Japanese (Native)</span>
              <span className="text-[10px] text-[#8C8C8C] mt-0.5">Coming Soon</span>
            </div>
          </div>

        </div>

      </div>

    </aside>
  );
}