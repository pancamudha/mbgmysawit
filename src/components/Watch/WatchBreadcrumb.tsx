"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface WatchBreadcrumbProps {
  episodeData: any;
  activePlayer: string;
  setActivePlayer: (player: any) => void;
}

export default function WatchBreadcrumb({ episodeData, activePlayer, setActivePlayer }: WatchBreadcrumbProps) {
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Mengambil parameter URL secara otomatis
  const params = useParams();
  const slug = (params?.slug as string) || '';

  // Menutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPlayerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fungsi pintar untuk mengubah url slug menjadi teks judul Anime yang rapi
  const formatTitle = (str: string) => {
    if (!str) return 'Anime Details';
    const parts = str.split('-');
    // Buang ID angka di belakang (contoh: -20333)
    if (parts.length > 1 && /^\d+$/.test(parts[parts.length - 1])) {
      parts.pop(); 
    }
    // Ubah huruf pertama tiap kata jadi kapital
    return parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const playerOptions = [
    { id: 'artplayer', label: 'Artplayer (Recommended)' },
    { id: 'plyr', label: 'Plyr' },
    { id: 'videojs', label: 'Video.js' },
    { id: 'iframe', label: 'Iframe' }
  ];

  const currentPlayerLabel = playerOptions.find(p => p.id === activePlayer)?.label;

  return (
    <div className="flex items-center justify-end sm:justify-between gap-2 py-2 px-3 sm:px-4 bg-[#0F0F0F] border border-[#2A2A2E] rounded-[10px]">
      
      {/* 🚀 BREADCRUMB ASLI - Disembunyikan di Mobile (hidden sm:flex) */}
      <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-[#8C8C8C] font-medium truncate">
         
         <Link href="/" className="hover:text-white transition-colors shrink-0">
            Home
         </Link>
         
         <ChevronRight className="w-3.5 h-3.5 text-[#3A3A3E] shrink-0" />
         
         <Link href={`/anime/${slug}`} className="hover:text-white transition-colors truncate max-w-[140px] sm:max-w-[200px] md:max-w-[300px]">
            {formatTitle(slug)}
         </Link>
         
         <ChevronRight className="w-3.5 h-3.5 text-[#3A3A3E] shrink-0" />
         
         <span className="text-white font-bold shrink-0">
            Episode {episodeData?.episode_no || '?'}
         </span>

      </div>

      {/* Player Selector Dropdown - Akan mengambil sisa ruang di Mobile agar rapi */}
      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
         <span className="text-[11px] text-[#8C8C8C] font-bold tracking-wider shrink-0">PLAYER:</span>
         
         <div className="relative shrink-0 z-[30] flex-1 sm:flex-none" ref={dropdownRef}>
           <button 
             onClick={() => setShowPlayerDropdown(!showPlayerDropdown)}
             className="flex items-center gap-2 h-7 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-2.5 rounded-[8px] text-[12px] font-medium text-slate-200 w-full sm:w-[190px] justify-between"
           >
             <span className="truncate">{currentPlayerLabel}</span>
             <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${showPlayerDropdown ? 'rotate-180' : ''}`} />
           </button>

           {showPlayerDropdown && (
             <div className="absolute top-full right-0 mt-1 w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[8px] shadow-2xl overflow-hidden z-[40]">
               {playerOptions.map((option) => (
                 <button
                   key={option.id}
                   onClick={() => {
                     setActivePlayer(option.id);
                     setShowPlayerDropdown(false);
                   }}
                   className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[#161616] transition-colors ${activePlayer === option.id ? 'text-white bg-[#161616]' : 'text-slate-300'}`}
                 >
                   {option.label}
                 </button>
               ))}
             </div>
           )}
         </div>
      </div>
    </div>
  );
}