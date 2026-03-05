"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AnimeHero from '@/components/AnimeDetail/AnimeHero';
import AnimeRelated from '@/components/AnimeDetail/AnimeRelated';
import AnimeCharacters from '@/components/AnimeDetail/AnimeCharacters';
import AnimeRecommendations from '@/components/AnimeDetail/AnimeRecommendations';
import AnimeTrailer from '@/components/AnimeDetail/AnimeTrailer';
import LoadingScreen from '@/components/LoadingScreen'; 

export default function AnimeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [animeData, setAnimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      const cacheKey = `animaple_cache_${slug}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        setAnimeData(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://animaple-core.vercel.app/api/anime/${slug}`);
        if (!res.ok) throw new Error("Gagal mengambil data");
        const json = await res.json();
        
        if (json && json.data) {
          setAnimeData(json.data);
          sessionStorage.setItem(cacheKey, JSON.stringify(json.data));
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAnimeDetail();
  }, [slug]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!animeData) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white">
        <h1 className="text-2xl font-bold mb-2">Anime tidak ditemukan</h1>
        <p className="text-[#8C8C8C]">Silakan kembali ke beranda.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-[#0A0A0B] pb-6">
      
      {/* BACKGROUND BANNER */}
      <div className="absolute top-0 left-0 w-full h-[450px] sm:h-[500px] z-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={animeData.banner || animeData.poster} 
          alt="Background" 
          className={`w-full h-full object-cover opacity-60 scale-105 ${!animeData.banner ? 'blur-sm' : ''}`} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B]/40 via-[#0A0A0B]/80 to-[#0A0A0B]" />
      </div>

      {/* CONTAINER UTAMA: Gap dikembalikan ke gap-6 sm:gap-8 agar rapat lagi */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-[30px] flex flex-col gap-6 sm:gap-8">
        
        {/* SECTION 1: HERO */}
        <AnimeHero anime={animeData} />
        
        {/* SECTION 2: GRID LAYOUT (Related + Trailer) */}
        {/* Grid 12 kolom dengan gap-5 agar sidebar & trailer dekat */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* KIRI (Sidebar Related): 3 Kolom */}
            <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
                 <AnimeRelated relations={animeData.relations} />
            </div>

            {/* KANAN (Main Trailer): 9 Kolom */}
            <div className="lg:col-span-9 order-1 lg:order-2">
                 <AnimeTrailer trailer={animeData.trailer} />
            </div>

        </div>
        
        {/* SECTION 3: CHARACTERS */}
        <AnimeCharacters characters={animeData.characters} />
        
        {/* SECTION 4: RECOMMENDATIONS */}
        <AnimeRecommendations recommendations={animeData.recommendations} />

      </div>
    </div>
  );
}