"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter(); 
  const [isScrolled, setIsScrolled] = useState(false);
  
  // === STATE UNTUK LIVE SEARCH ===
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  
  // === STATE UNTUK RANDOM ANIME ===
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (desktopSearchRef.current && !desktopSearchRef.current.contains(target)) &&
        (mobileSearchRef.current && !mobileSearchRef.current.contains(target))
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Efek Fetch Live Search menggunakan API bowotheexplorer
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const res = await fetch(`https://bowotheexplorer.vercel.app/api/search?keyword=${encodeURIComponent(query.trim())}&page=1`);
          if (!res.ok) throw new Error("Fetch failed");
          const json = await res.json();
          
          if (json?.results?.data && Array.isArray(json.results.data)) {
            setResults(json.results.data);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error("Search failed:", error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle tekan Enter untuk pencarian
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      setShowDropdown(false);
      setShowMobileSearch(false);
      router.push(`/search/${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  // FUNGSI RANDOM ANIME (Diperbarui menggunakan trik pencarian abjad acak ke bowo api)
  const handleRandomAnime = async () => {
    if (isRandomLoading) return;
    setIsRandomLoading(true);

    try {
      // Menghasilkan satu huruf acak antara a-z
      const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); 
      
      const res = await fetch(`https://bowotheexplorer.vercel.app/api/search?keyword=${randomChar}&page=1`);
      if (!res.ok) throw new Error("Gagal mengambil data random");
      
      const json = await res.json();
      const list = json?.results?.data || [];

      if (list.length > 0) {
        // Pilih 1 index acak dari hasil pencarian
        const randomIndex = Math.floor(Math.random() * list.length);
        const randomAnime = list[randomIndex];
        
        if (randomAnime && randomAnime.id) {
          router.push(`/anime/${randomAnime.id}`);
        }
      } else {
        console.warn("Tidak menemukan anime acak, coba lagi.");
      }
    } catch (error) {
      console.error("Error random anime:", error);
    } finally {
      // Delay sedikit agar animasi loading terasa lebih smooth
      setTimeout(() => setIsRandomLoading(false), 500);
    }
  };

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-expanded');
  };

  const renderDropdown = () => (
    <div className="fixed md:absolute top-[65px] md:top-full left-4 right-4 md:left-0 md:right-auto md:w-full mt-0 md:mt-2 max-h-[70vh] md:max-h-[500px] bg-[#141414] md:bg-[#0F0F0F] border border-[#2A2A2E] rounded-xl shadow-2xl z-[100] flex flex-col overflow-hidden">
      {isSearching ? (
        <div className="p-8 text-center text-sm text-[#8C8C8C] flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium tracking-wide">Searching anime...</span>
        </div>
      ) : results.length > 0 ? (
        <>
          {/* === HEADER SUGGESTIONS === */}
          <div className="flex justify-between items-center px-3 py-2 border-b border-[#2A2A2E] shrink-0 bg-[#0A0A0A]/50">
            <span className="text-[10px] font-bold text-[#8C8C8C] tracking-wider uppercase">Suggestions</span>
            <span className="text-[10px] font-medium text-[#8C8C8C]">{results.length} results</span>
          </div>

          {/* === LIST ANIME === */}
          <div className="p-1.5 flex flex-col gap-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2A2A2E] [&::-webkit-scrollbar-thumb]:rounded-full">
            {results.slice(0, 5).map((anime: any, idx: number) => (
              <Link 
                href={`/anime/${anime.id}`} 
                key={idx} 
                onClick={() => { setShowDropdown(false); setShowMobileSearch(false); setQuery(''); }} 
                className="group/item relative flex items-center gap-3.5 p-2 rounded-xl overflow-hidden bg-[#141414] border border-transparent hover:border-white/10 active:border-white/10 transition-all duration-300 shrink-0"
              >
                {/* === BACKGROUND BANNER === */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={anime.poster} alt="" className="w-full h-full object-cover scale-110 grayscale opacity-[0.15] group-hover/item:grayscale-0 group-hover/item:translate-x-[4px] group-hover/item:opacity-[0.4] group-active/item:grayscale-0 group-active/item:translate-x-[4px] group-active/item:opacity-[0.4] transition-all duration-500 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent" />
                </div>

                {/* === THUMBNAIL POSTER === */}
                <div className="w-10 sm:w-[46px] aspect-[4/5] rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 relative z-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/item:translate-x-1 group-active/item:translate-x-1">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover" />
                </div>

                {/* === TEXT INFO === */}
                <div className="flex flex-col flex-1 py-0.5 pr-2 z-10 transition-transform duration-500 group-hover/item:translate-x-1 group-active/item:translate-x-1">
                  <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-200 group-hover/item:text-white/90 group-active/item:text-white/90 line-clamp-2 leading-snug mb-1 drop-shadow-md transition-colors">
                    {anime.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#8C8C8C] uppercase tracking-wider drop-shadow-md">
                    <span className={anime.tvInfo?.showType === 'Completed' ? 'text-indigo-400' : 'text-emerald-400'}>
                      {anime.tvInfo?.showType || 'TV'}
                    </span>
                    {anime.tvInfo?.sub && (
                      <>
                        <span className="text-[#4A4A4E]">•</span>
                        <span className="flex items-center gap-0.5 text-white/80">
                           {anime.tvInfo.sub} Eps
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* === FOOTER PRESS ENTER === */}
          <div className="border-t border-[#2A2A2E] py-2.5 px-3 flex justify-center shrink-0 bg-[#0A0A0A]/50">
             <Link 
               href={`/search/${query}`} 
               onClick={() => { setShowDropdown(false); setShowMobileSearch(false); setQuery(''); }} 
               className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#8C8C8C] hover:text-white active:text-white transition-colors"
             >
               Press Enter for all results
               <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                 <circle cx="11" cy="11" r="8"></circle>
                 <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
               </svg>
             </Link>
          </div>
        </>
      ) : (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
          <svg className="w-10 h-10 text-[#4A4A4E] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-white">Oops, not found!</span>
          <span className="text-[13px] text-[#8C8C8C]">Try using different keywords.</span>
        </div>
      )}
    </div>
  );

  return (
    <header className={`fixed top-0 left-0 w-full h-[60px] z-50 transition-all duration-300 border-b border-[#2A2A2E] ${isScrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl shadow-xl' : 'bg-[#0A0A0A]'}`}>
      
      <div className="flex items-center justify-between w-full h-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className={`flex items-center gap-3 sm:gap-5 shrink-0 ${showMobileSearch ? 'hidden md:flex' : 'flex'}`}>
          <button onClick={toggleSidebar} className={`flex items-center justify-center w-11 h-11 border border-[#2A2A2E] hover:border-[#3A3A3E] rounded-[10px] text-slate-300 hover:text-white transition-all shrink-0 ${isScrolled ? 'bg-[#0F0F0F]/60 hover:bg-[#161616]/80' : 'bg-[#0F0F0F] hover:bg-[#161616]'}`} aria-label="Menu">
            <svg className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
          </button>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="Animaple Logo" className="h-[30px] sm:h-[34px] w-auto object-contain drop-shadow-sm" />
              <div className="hidden sm:flex flex-col justify-center ml-2 leading-none">
                <span className="text-[19px] font-black text-white tracking-tight">ANIMAPLE</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-[500px] w-full mx-6 gap-2 relative" ref={desktopSearchRef}>
          <div className="relative w-full h-11 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors">
              <svg className="w-[20px] h-[20px] text-[#8C8C8C] group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            
            <input 
              type="text" value={query} onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className={`block w-full h-full pl-11 pr-10 border border-[#2A2A2E] focus:border-[#3A3A3E] rounded-[10px] text-slate-200 placeholder-[#8C8C8C] focus:outline-none transition-all text-[15px] font-medium ${isScrolled ? 'bg-[#0F0F0F]/60 focus:bg-[#161616]/80' : 'bg-[#0F0F0F] focus:bg-[#161616]'}`} 
              placeholder="Search anime..." 
            />
            
            {query && (
                <button onClick={() => { setQuery(''); desktopSearchRef.current?.querySelector('input')?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8C8C8C] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}

            {showDropdown && query.trim().length >= 2 && renderDropdown()}
          </div>
          
          <button 
            onClick={handleRandomAnime}
            disabled={isRandomLoading}
            className={`flex items-center justify-center w-11 h-11 border border-[#2A2A2E] hover:border-[#3A3A3E] rounded-[10px] text-slate-300 hover:text-white transition-all shrink-0 disabled:opacity-50 disabled:cursor-wait ${isScrolled ? 'bg-[#0F0F0F]/60 hover:bg-[#161616]/80' : 'bg-[#0F0F0F] hover:bg-[#161616]'}`} 
            aria-label="Random Anime"
            title="Random Anime"
          >
              {isRandomLoading ? (
                 <svg className="animate-spin w-[20px] h-[20px] text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : (
                 <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 32 32"><path d="M 23 3 L 23 7 L 18.40625 7 L 18.125 7.5 L 14.5 13.96875 L 10.59375 7 L 4 7 L 4 9 L 9.40625 9 L 13.34375 16 L 9.40625 23 L 4 23 L 4 25 L 10.59375 25 L 19.59375 9 L 23 9 L 23 13 L 28 8 Z M 16.78125 18 L 15.625 20.0625 L 18.40625 25 L 23 25 L 23 29 L 28 24 L 23 19 L 23 23 L 19.59375 23 Z"></path></svg>
              )}
          </button>
        </div>

        {showMobileSearch && (
          <div className="flex md:hidden flex-1 items-center gap-2 sm:gap-3 mr-2 animate-in fade-in duration-200" ref={mobileSearchRef}>
            <button onClick={() => { setShowMobileSearch(false); setQuery(''); setShowDropdown(false); }} className="text-slate-300 hover:text-white p-1.5 -ml-1.5 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <div className="relative w-full h-11 group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
                <svg className="w-[18px] h-[18px] text-[#8C8C8C] group-focus-within:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              
              <input 
                autoFocus
                type="text" value={query} onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }} onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className={`block w-full h-full pl-10 pr-10 border border-[#2A2A2E] focus:border-[#3A3A3E] rounded-[10px] text-slate-200 placeholder-[#8C8C8C] focus:outline-none transition-all text-[15px] font-medium ${isScrolled ? 'bg-[#0F0F0F]/60' : 'bg-[#0F0F0F]'}`} 
                placeholder="Search anime..." 
              />
              
              {query && (
                <button onClick={() => { setQuery(''); mobileSearchRef.current?.querySelector('input')?.focus(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#8C8C8C] hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}

              {showDropdown && query.trim().length >= 2 && renderDropdown()}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {!showMobileSearch && (
            <button 
              onClick={() => setShowMobileSearch(true)}
              className={`flex md:hidden items-center justify-center w-11 h-11 border border-[#2A2A2E] hover:border-[#3A3A3E] rounded-[10px] text-slate-300 hover:text-white transition-all shrink-0 ${isScrolled ? 'bg-[#0F0F0F]/60 hover:bg-[#161616]/80' : 'bg-[#0F0F0F] hover:bg-[#161616]'}`} 
              aria-label="Search"
            >
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          )}

          <button className={`flex items-center justify-center w-11 h-11 border border-[#2A2A2E] hover:border-[#3A3A3E] rounded-[10px] text-slate-300 hover:text-white transition-all shrink-0 ${isScrolled ? 'bg-[#0F0F0F]/60 hover:bg-[#161616]/80' : 'bg-[#0F0F0F] hover:bg-[#161616]'}`} aria-label="Inbox">
            <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>
          </button>

          <button className={`flex items-center justify-center w-11 h-11 border border-[#2A2A2E] hover:border-[#3A3A3E] rounded-[10px] text-slate-300 hover:text-white transition-all shrink-0 ${isScrolled ? 'bg-[#0F0F0F]/60 hover:bg-[#161616]/80' : 'bg-[#0F0F0F] hover:bg-[#161616]'}`} aria-label="Profile">
            <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </button>

        </div>
      </div>
    </header>
  );
}