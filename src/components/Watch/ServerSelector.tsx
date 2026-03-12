"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Download, Clock, ChevronDown } from 'lucide-react';

export default function ServerSelector({ servers, audioType, setAudioType, currentServer, setCurrentServer, currentEpisodeNumber, episodeData }: any) {
  const subServers = servers?.filter((s: any) => s.type === 'sub') || [];
  const dubServers = servers?.filter((s: any) => s.type === 'dub') || [];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  // === LOGIKA SIMPLE ALA VIDEO PLAYER OFIK ===
  const displayTitle = episodeData?.title || 'Loading...';
  const displayEpisodeNo = episodeData?.episode_no || currentEpisodeNumber || '?';
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleServerChange = (type: string, serverName: string) => {
    setAudioType(type);
    setCurrentServer(serverName.toLowerCase());
    setOpenDropdown(null);
  };

  const activeSubLabel = audioType === 'sub' 
    ? subServers.find((s: any) => s.serverName.toLowerCase() === currentServer.toLowerCase())?.serverName || (subServers[0]?.serverName || 'Select')
    : (subServers[0]?.serverName || 'Select');

  const activeDubLabel = audioType === 'dub'
    ? dubServers.find((s: any) => s.serverName.toLowerCase() === currentServer.toLowerCase())?.serverName || 'Any'
    : 'Any';

  return (
    <div className="flex flex-col gap-3 mt-2 text-white font-sans w-full">
      
      {/* Bagian Atas: Judul & Selector */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 w-full">
        
        {/* Info Episode */}
        <div className="flex flex-col min-w-0 flex-1 items-center text-center md:items-start md:text-left w-full md:pr-4">
          {/* HU TAO UDAH BALIKIN JADI text-2xl DI SINI! 🔥 */}
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
          
          {/* SUB DROPDOWN */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-bold uppercase text-white">SUB</span>
            <div className="relative shrink-0 z-[30]">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'sub' ? null : 'sub')}
                className="flex items-center gap-2 h-8 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-3 rounded-[8px] text-[13px] font-medium text-slate-200 w-[110px] justify-between"
              >
                <span className="truncate">{activeSubLabel}</span>
                <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${openDropdown === 'sub' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'sub' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 md:right-auto mt-1 w-[130px] md:w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[8px] shadow-2xl overflow-hidden z-[40]">
                  {subServers.length > 0 ? (
                    subServers.map((srv: any) => (
                      <button
                        key={srv.data_id}
                        onClick={() => handleServerChange('sub', srv.serverName)}
                        className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[#161616] transition-colors ${audioType === 'sub' && currentServer.toLowerCase() === srv.serverName.toLowerCase() ? 'text-white bg-[#161616]' : 'text-slate-300'}`}
                      >
                        {srv.serverName}
                      </button>
                    ))
                  ) : (
                    <button 
                      onClick={() => setOpenDropdown(null)}
                      className="w-full text-left px-3 py-2 text-[12px] font-medium text-slate-500 cursor-not-allowed"
                    >
                      No Sub
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DUB DROPDOWN */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-bold uppercase text-white">DUB</span>
            <div className="relative shrink-0 z-[30]">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'dub' ? null : 'dub')}
                className="flex items-center gap-2 h-8 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-3 rounded-[8px] text-[13px] font-medium text-slate-200 w-[110px] justify-between"
              >
                <span className="truncate">{activeDubLabel}</span>
                <ChevronDown className={`shrink-0 w-3.5 h-3.5 text-[#8C8C8C] transition-transform ${openDropdown === 'dub' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'dub' && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 md:right-auto mt-1 w-[130px] md:w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[8px] shadow-2xl overflow-hidden z-[40]">
                  {dubServers.length > 0 ? (
                    dubServers.map((srv: any) => (
                      <button
                        key={srv.data_id}
                        onClick={() => handleServerChange('dub', srv.serverName)}
                        className={`w-full text-left px-3 py-2 text-[12px] font-medium hover:bg-[#161616] transition-colors ${audioType === 'dub' && currentServer.toLowerCase() === srv.serverName.toLowerCase() ? 'text-white bg-[#161616]' : 'text-slate-300'}`}
                      >
                        {srv.serverName}
                      </button>
                    ))
                  ) : (
                    <button 
                      onClick={() => setOpenDropdown(null)}
                      className="w-full text-left px-3 py-2 text-[12px] font-medium text-slate-500 cursor-not-allowed hover:bg-[#161616] transition-colors"
                    >
                      Any
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