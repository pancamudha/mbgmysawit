"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Download, Clock, ChevronDown } from 'lucide-react';
import { useAnimeTitle } from '@/context/TitleLanguageContext';

export default function ServerSelector({ 
  mwData, 
  providersList, 
  currentProvider, 
  setCurrentProvider, 
  audioType, 
  setAudioType, 
  currentEpisodeNumber, 
  episodeData 
}: any) {
  const { getTitle } = useAnimeTitle(); // Memanggil Hook Bahasa

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const displayTitle = getTitle(episodeData?.title, episodeData?.japanese_title) || 'Loading...';
  const displayEpisodeNo = episodeData?.episode_no || currentEpisodeNumber || '?';

  // Menentukan audio apa saja yang tersedia untuk provider saat ini
  const availableAudioTypes = [];
  if (mwData?.[currentProvider]?.episodes?.sub?.length > 0) availableAudioTypes.push('sub');
  if (mwData?.[currentProvider]?.episodes?.dub?.length > 0) availableAudioTypes.push('dub');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <div className="flex flex-col gap-3 mt-2 text-white font-sans w-full">
      
      {/* Bagian Atas: Judul & Selector */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 w-full">
        
        {/* Info Episode */}
        <div className="flex flex-col min-w-0 flex-1 items-center text-center md:items-start md:text-left w-full md:pr-4">
          <h1 
            className="text-2xl font-bold tracking-tight w-full md:truncate" 
            title={`Episode ${displayEpisodeNo}: ${displayTitle}`}
          >
            Episode {displayEpisodeNo}: {displayTitle}
          </h1>
          <p className="text-[#8C8C8C] text-[12px] font-medium w-full mt-0.5 md:truncate">
            If current server doesn't work try other servers beside.
          </p>
        </div>

        {/* Area Tombol & Dropdown Kustom */}
        <div className="flex flex-wrap justify-center items-center gap-3 shrink-0 w-full md:w-auto" ref={dropdownContainerRef}>
          
          {/* AUDIO DROPDOWN (KIRI) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-bold uppercase text-white">AUDIO</span>
            <div className="relative shrink-0 z-[30]">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'audio' ? null : 'audio')}
                className="flex items-center gap-2 h-8 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-3 rounded-[8px] text-[13px] font-medium text-slate-200 w-[110px] justify-between"
              >
                <span className="truncate">{capitalize(audioType)}</span>
                <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${openDropdown === 'audio' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'audio' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 md:right-auto mt-1 w-[130px] md:w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[8px] shadow-2xl overflow-hidden z-[40]">
                  {availableAudioTypes.length > 0 ? (
                    availableAudioTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setAudioType(type);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[#161616] transition-colors ${audioType === type ? 'text-white bg-[#161616]' : 'text-slate-300'}`}
                      >
                        {capitalize(type)}
                      </button>
                    ))
                  ) : (
                    <button 
                      onClick={() => setOpenDropdown(null)}
                      className="w-full text-left px-3 py-2 text-[12px] font-medium text-slate-500 cursor-not-allowed"
                    >
                      No Audio
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* PROVIDER DROPDOWN (KANAN) */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-bold uppercase text-white">SERVER</span>
            <div className="relative shrink-0 z-[30]">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'provider' ? null : 'provider')}
                className="flex items-center gap-2 h-8 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-3 rounded-[8px] text-[13px] font-medium text-slate-200 w-[110px] justify-between"
              >
                <span className="truncate">{capitalize(currentProvider)}</span>
                <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${openDropdown === 'provider' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'provider' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 md:right-auto mt-1 w-[130px] md:w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[8px] shadow-2xl overflow-hidden z-[40]">
                  {providersList && providersList.length > 0 ? (
                    providersList.map((prov: string) => (
                      <button
                        key={prov}
                        onClick={() => {
                          setCurrentProvider(prov);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[#161616] transition-colors ${currentProvider === prov ? 'text-white bg-[#161616]' : 'text-slate-300'}`}
                      >
                        {capitalize(prov)}
                      </button>
                    ))
                  ) : (
                    <button 
                      onClick={() => setOpenDropdown(null)}
                      className="w-full text-left px-3 py-2 text-[12px] font-medium text-slate-500 cursor-not-allowed hover:bg-[#161616] transition-colors"
                    >
                      Empty
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* TOMBOL DOWNLOAD */}
          <button className="flex items-center justify-center gap-2 h-8 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-4 rounded-[8px] text-[13px] font-medium text-slate-200 shrink-0">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Bagian Bawah: Banner Next Episode */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 bg-[#121215] border border-white/5 rounded-xl p-3 text-sm text-[#8C8C8C] text-center md:text-left">
        <Clock className="w-4 h-4 shrink-0" />
        <span className="shrink-0">Estimated next episode will come at</span>
        <span className="text-white font-bold ml-1 shrink-0">EP {!isNaN(Number(displayEpisodeNo)) ? Number(displayEpisodeNo) + 1 : '?'}</span>
        <span className="mx-1 shrink-0">IN</span>
        <span className="text-white font-bold shrink-0">2h 36m</span>
      </div>

    </div>
  );
}