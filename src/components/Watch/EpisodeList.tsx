"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Eye, Image as ImageIcon, ChevronDown, LayoutGrid, Play, List } from 'lucide-react';

export default function EpisodeList({ episodes = [], currentEp, onSelectEpisode }: any) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  
  const [viewMode, setViewMode] = useState<'thumbnail' | 'grid' | 'compact'>('thumbnail');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const chunkSize = 100;

  const chunks = useMemo(() => {
    if (!episodes || episodes.length === 0) return [];
    const result = [];
    for (let i = 0; i < episodes.length; i += chunkSize) {
      result.push(episodes.slice(i, i + chunkSize));
    }
    return result;
  }, [episodes]);

  const currentEpisodes = chunks[currentChunkIndex] || [];

  const filteredEpisodes = currentEpisodes.filter((ep: any) => 
    ep.episode_no?.toString().includes(search) || 
    ep.title?.toLowerCase().includes(search.toLowerCase()) ||
    ep.japanese_title?.toLowerCase().includes(search.toLowerCase())
  );

  const getChunkLabel = (index: number, chunk: any[]) => {
    if (!chunk || chunk.length === 0) return "EPS 0";
    const start = chunk[0].episode_no;
    const end = chunk[chunk.length - 1].episode_no;
    return `EPS ${start} - ${end}`;
  };

  const currentLabel = chunks.length > 0 ? getChunkLabel(currentChunkIndex, chunks[currentChunkIndex]) : "No EPS";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleViewToggle = () => {
    if (viewMode === 'thumbnail') setViewMode('grid');
    else if (viewMode === 'grid') setViewMode('compact');
    else setViewMode('thumbnail');
  };

  return (
    <div className="flex flex-col w-full bg-[#0A0A0A] border border-[#2A2A2E] rounded-lg overflow-hidden h-fit max-h-[348px] lg:h-full lg:max-h-[800px] font-sans relative z-0">
      
      {/* Header Controls */}
      <div className="p-2 border-b border-[#2A2A2E] flex items-center gap-2 relative z-[20]">
        
        <div className="relative shrink-0 z-[30]" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 h-9 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] transition-all px-3 rounded-[10px] text-sm font-medium text-slate-200 min-w-[100px] justify-between"
          >
            <span>{currentLabel}</span>
            <ChevronDown className={`w-4 h-4 text-[#8C8C8C] transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Menambahkan custom scrollbar pada Dropdown Menu juga agar konsisten */}
          {showDropdown && chunks.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-full bg-[#0F0F0F] border border-[#2A2A2E] rounded-[10px] shadow-2xl overflow-hidden z-[40] max-h-[278px] overflow-y-auto [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2A2A2E] hover:[&::-webkit-scrollbar-thumb]:bg-[#3A3A3E] [&::-webkit-scrollbar-thumb]:rounded-full">
              {chunks.map((chunk, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentChunkIndex(idx);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm font-semibold hover:bg-[#161616] transition-colors ${currentChunkIndex === idx ? 'text-white bg-[#161616]' : 'text-slate-300'}`}
                >
                  {getChunkLabel(idx, chunk)}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="relative flex-1 h-9 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors">
            <Search className="w-4 h-4 text-[#8C8C8C] group-focus-within:text-white transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Filter episodes..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full h-full pl-9 pr-3 border border-[#2A2A2E] focus:border-[#3A3A3E] rounded-[10px] text-slate-200 placeholder-[#8C8C8C] focus:outline-none transition-all text-sm font-medium bg-[#0F0F0F] focus:bg-[#161616]"
          />
        </div>

        <button className="flex items-center justify-center shrink-0 w-9 h-9 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] rounded-[10px] text-slate-300 hover:text-white transition-all">
          <Eye className="w-4 h-4" />
        </button>
        
        <button 
          onClick={handleViewToggle}
          className="flex items-center justify-center shrink-0 w-9 h-9 bg-[#0F0F0F] border border-[#2A2A2E] hover:border-[#3A3A3E] hover:bg-[#161616] rounded-[10px] text-slate-300 hover:text-white transition-all"
          title="Toggle View Mode"
        >
          {viewMode === 'thumbnail' && <ImageIcon className="w-4 h-4" />}
          {viewMode === 'grid' && <LayoutGrid className="w-4 h-4" />}
          {viewMode === 'compact' && <List className="w-4 h-4" />}
        </button>
      </div>

      {/* Scrollable Content */}
      {/* UPDATE DI SINI: custom-scrollbar diganti dengan utilitas Webkit tipis ala ExploreFilterBar */}
      <div className="flex-1 overflow-y-auto p-2 relative z-0 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2A2A2E] hover:[&::-webkit-scrollbar-thumb]:bg-[#3A3A3E] [&::-webkit-scrollbar-thumb]:rounded-full">
        {filteredEpisodes.length > 0 ? (
          
          /* ================= GRID VIEW ================= */
          viewMode === 'grid' ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {filteredEpisodes.map((ep: any) => {
                const epId = ep.id ? ep.id.split('?ep=')[1] : ep.episode_no;
                const isActive = currentEp === epId;

                return (
                  <button
                    key={ep.id || ep.episode_no}
                    onClick={() => onSelectEpisode(epId)}
                    className={`flex items-center justify-center h-[42px] rounded-lg font-bold text-[14px] transition-all border ${
                      isActive
                        ? 'bg-[#1A1A1C] border-[#4A4A4E] text-white shadow-[0_0_10px_rgba(255,255,255,0.03)]'
                        : 'bg-[#0F0F0F] border-[#2A2A2E] text-[#8C8C8C] hover:bg-[#161616] hover:border-[#3A3A3E] hover:text-white'
                    }`}
                  >
                    {isActive ? <Play className="w-4 h-4 fill-current" /> : ep.episode_no}
                  </button>
                );
              })}
            </div>
          ) : 
          
          /* ================= COMPACT VIEW ================= */
          viewMode === 'compact' ? (
            <div className="flex flex-col gap-1.5">
              {filteredEpisodes.map((ep: any) => {
                const epId = ep.id ? ep.id.split('?ep=')[1] : ep.episode_no;
                const isActive = currentEp === epId;

                return (
                  <button
                    key={ep.id || ep.episode_no}
                    onClick={() => onSelectEpisode(epId)}
                    className={`group flex items-center justify-between w-full text-left px-3 py-2.5 rounded-[10px] transition-all border shrink-0 overflow-hidden ${
                      isActive 
                      ? 'bg-[#1A1A1C] border-[#4A4A4E] shadow-[0_0_10px_rgba(255,255,255,0.03)]' 
                      : 'bg-[#0F0F0F] border-[#2A2A2E] hover:bg-[#161616] hover:border-[#3A3A3E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {isActive ? (
                        <Play className="w-3.5 h-3.5 fill-current text-white shrink-0" />
                      ) : (
                        <span className="text-[13px] font-bold text-[#8C8C8C] shrink-0 w-5 text-center">
                          {ep.episode_no}.
                        </span>
                      )}
                      <h4 className={`text-[13px] sm:text-sm line-clamp-1 truncate transition-colors ${isActive ? 'text-white font-bold' : 'text-[#8C8C8C] font-semibold group-hover:text-white'}`} title={ep.title}>
                        {ep.title || ep.japanese_title}
                      </h4>
                    </div>

                    <div className="shrink-0 ml-3">
                      {ep.filler ? (
                        <div className="text-[8px] font-extrabold bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-[3px] px-1 py-[2px] leading-none">
                          FILLER
                        </div>
                      ) : (
                        <div className="text-[8px] font-extrabold bg-[#8C8C8C] text-[#0A0A0A] rounded-[3px] px-1 py-[2px] leading-none transition-colors group-hover:bg-slate-300">
                          CC
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : 
          
          /* ================= THUMBNAIL VIEW ================= */
          (
            <div className="flex flex-col gap-2">
              {filteredEpisodes.map((ep: any) => {
                const epId = ep.id ? ep.id.split('?ep=')[1] : ep.episode_no;
                const isActive = currentEp === epId;

                return (
                  <button
                    key={ep.id || ep.episode_no}
                    onClick={() => onSelectEpisode(epId)}
                    className={`group flex flex-row w-full text-left rounded-[10px] transition-all border shrink-0 overflow-hidden ${
                      isActive 
                      ? 'bg-[#1A1A1C] border-[#4A4A4E] shadow-[0_0_10px_rgba(255,255,255,0.03)]' 
                      : 'bg-[#0F0F0F] border-[#2A2A2E] hover:bg-[#161616] hover:border-[#3A3A3E]'
                    }`}
                  >
                    <div className="relative w-[130px] lg:w-[145px] shrink-0 h-[85px] lg:h-[95px] bg-[#141414] border-r border-[#2A2A2E] flex items-center justify-center overflow-hidden rounded-[10px]">
                      {ep.thumbnail ? (
                        <img 
                          src={ep.thumbnail} 
                          alt={ep.title}
                          className={`w-full h-full object-cover transition-all ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#8C8C8C] gap-1 opacity-50 absolute inset-0">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[10px] font-bold">NO IMAGE</span>
                        </div>
                      )}
                      
                      <div className="absolute bottom-1.5 left-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-2 py-[3px] leading-none rounded-md shadow-sm z-10">
                        EP {ep.episode_no}
                      </div>
                    </div>

                    <div className="flex flex-col flex-1 p-2.5 justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`text-sm line-clamp-1 truncate transition-colors ${isActive ? 'text-white font-bold' : 'text-[#8C8C8C] font-semibold group-hover:text-white'}`} title={ep.title}>
                            {ep.title}
                          </h4>
                          
                          {ep.filler ? (
                            <div className="shrink-0 text-[8px] font-extrabold bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded-[3px] px-1 py-[2px] mt-0.5 leading-none">
                              FILLER
                            </div>
                          ) : (
                            <div className="shrink-0 text-[8px] font-extrabold bg-[#8C8C8C] text-[#0A0A0A] rounded-[3px] px-1 py-[2px] mt-0.5 leading-none transition-colors group-hover:bg-slate-300">
                              CC
                            </div>
                          )}
                        </div>
                        
                        <p className={`text-xs mt-1.5 line-clamp-2 leading-snug transition-colors ${isActive ? 'text-slate-400 font-medium' : 'text-[#8C8C8C]'}`} title={ep.japanese_title}>
                          {ep.japanese_title || 'No description available.'}
                        </p>
                      </div>
                      
                      <div className={`text-right text-[10px] mt-1 transition-colors ${isActive ? 'text-slate-400 font-medium' : 'text-[#4A4A4E] font-semibold group-hover:text-[#8C8C8C]'}`}>
                        {ep.date || ''}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )

        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full gap-2">
            <Search className="w-8 h-8 text-[#4A4A4E] mb-2" />
            <span className="text-sm font-bold text-white">Episode tidak ditemukan!</span>
            <span className="text-[13px] text-[#8C8C8C]">Coba kata kunci lain.</span>
          </div>
        )}
      </div>
    </div>
  );
}