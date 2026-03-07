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

  // FUNGSI RANDOM ANIME MENGGUNAKAN ENDPOINT RESMI API
  const handleRandomAnime = async () => {
    if (isRandomLoading) return;
    setIsRandomLoading(true);

    try {
      const res = await fetch(`https://bowotheexplorer.vercel.app/api/random`);
      if (!res.ok) throw new Error("Gagal mengambil data random");
      
      const json = await res.json();
      const randomAnime = json?.results?.data; // Tergantung struktur respon endpoint random

      if (randomAnime && randomAnime.id) {
        router.push(`/anime/${randomAnime.id}`);
      } else {
        console.warn("Gagal mendapatkan anime acak.");
      }
    } catch (error) {
      console.error("Error random anime:", error);
    } finally {
      setIsRandomLoading(false);
    }
  };

  const toggleSidebar = () => {
    document.body.classList.toggle('sidebar-expanded');
  };

  const renderDropdown = () => (
    <div className="fixed md:absolute top-[65px] md:top-full left-4 right-4 md:left-0 md:right-auto md:w-full mt-0 md:mt-2 max-h-[65vh] md:max-h-[400px] overflow-y-auto bg-[#141414] md:bg-[#0F0F0F] border border-[#2A2A2E] rounded-xl shadow-2xl z-[100] flex flex-col [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#2A2A2E] [&::-webkit-scrollbar-thumb]:rounded-full">
      {isSearching ? (
        <div className="p-5 text-center text-sm text-[#8C8C8C] flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="font-medium tracking-wide">Mencari anime...</span>
        </div>
      ) : results.length > 0 ? (
        <div className="p-1.5 flex flex-col gap-1">
          {results.slice(0, 6).map((anime: any, idx: number) => (
            <Link 
              href={`/anime/${anime.id}`} 
              key={idx} 
              onClick={() => { setShowDropdown(false); setShowMobileSearch(false); setQuery(''); }} 
              className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            >
              <div className="w-10 sm:w-11 aspect-[3/4] rounded-md overflow-hidden bg-[#1A1A1C] shrink-0 shadow-sm relative">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={anime.poster} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col py-0.5 pr-2 flex-1">
                <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-200 group-hover:text-white line-clamp-2 leading-snug mb-1">
                  {anime.title}
                </h4>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wider">
                  <span className={anime.tvInfo?.showType === 'Completed' ? 'text-indigo-400' : 'text-emerald-400'}>
                    {anime.tvInfo?.showType || 'ANIME'}
                  </span>
                  {anime.tvInfo?.sub && (
                    <>
                      <span className="text-[#4A4A4E]">•</span>
                      <span className="flex items-center gap-0.5">
                         {anime.tvInfo.sub} Eps
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
          
          {results.length > 6 && (
             <Link href={`/search/${query}`} onClick={() => { setShowDropdown(false); setShowMobileSearch(false); setQuery(''); }} className="text-center p-2.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-white/[0.02] hover:bg-white/[0.04] rounded-lg mt-1">
               Lihat semua {results.length} hasil pencarian
             </Link>
          )}
        </div>
      ) : (
        <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
          <svg className="w-10 h-10 text-[#4A4A4E] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-white">Aduh, tidak ditemukan!</span>
          <span className="text-[13px] text-[#8C8C8C]">Coba gunakan kata kunci yang berbeda.</span>
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
              className={`block w-full h-full pl-11 pr-10 border border-[#2A2A2E] focus:border-[#3A3A3E] rounded-[10px] text-slate-200 placeholder-[#8C8C8C] focus:outline-none transition-all text-[15px] font-medium ${isScrolled ? 'bg-[#0F0F0F]/60 focus:bg-[#161616]/80' : 'bg-[#0F0F0F] focus:bg-[#161616]'}`} 
              placeholder="Search anime" 
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
                className={`block w-full h-full pl-10 pr-10 border border-[#2A2A2E] focus:border-[#3A3A3E] rounded-[10px] text-slate-200 placeholder-[#8C8C8C] focus:outline-none transition-all text-[15px] font-medium ${isScrolled ? 'bg-[#0F0F0F]/60' : 'bg-[#0F0F0F]'}`} 
                placeholder="Search anime" 
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